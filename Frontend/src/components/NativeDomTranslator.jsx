import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { nativeDomPhrases } from '../utils/nativeDomPhrases';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CANVAS', 'SVG', 'CODE', 'PRE']);
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
const REACT_TRANSLATED_ROUTES = ['/dashboard', '/challans', '/challan'];

const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

const isReactTranslatedRoute = (pathname) =>
  REACT_TRANSLATED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const clearLegacyGoogleTranslate = () => {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const hostname = window.location.hostname;

  document.cookie = `googtrans=;${expires};path=/`;
  if (hostname) {
    document.cookie = `googtrans=;${expires};path=/;domain=${hostname}`;
    document.cookie = `googtrans=;${expires};path=/;domain=.${hostname}`;
  }

  document
    .querySelectorAll('#google-translate-widget-script, #google_translate_element, iframe.goog-te-banner-frame, .goog-te-banner-frame, .goog-te-balloon-frame')
    .forEach((node) => node.remove());
  document.body.style.top = '0px';
};

const flattenTranslationPairs = (englishValue, translatedValue, output) => {
  if (typeof englishValue === 'string' && typeof translatedValue === 'string') {
    const key = normalizeText(englishValue);
    if (key && translatedValue && key !== normalizeText(translatedValue)) {
      output[key] = translatedValue;
    }
    return;
  }

  if (!englishValue || !translatedValue || typeof englishValue !== 'object' || typeof translatedValue !== 'object') {
    return;
  }

  Object.keys(englishValue).forEach((key) => {
    flattenTranslationPairs(englishValue[key], translatedValue[key], output);
  });
};

const buildDictionary = (language) => {
  if (language === 'en') return {};

  const dictionary = {};
  flattenTranslationPairs(translations.en, translations[language], dictionary);
  return {
    ...dictionary,
    ...(nativeDomPhrases[language] || {}),
  };
};

const shouldSkipNode = (node) => {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  if (parent.closest('[data-no-native-translate], .notranslate')) return true;
  if (parent.isContentEditable) return true;
  return false;
};

const translateTextNode = (node, dictionary, originals) => {
  if (shouldSkipNode(node)) return;

  const currentKey = normalizeText(node.nodeValue || '');
  const original = originals.get(node) || node.nodeValue;
  const leading = original.match(/^\s*/)?.[0] || '';
  const trailing = original.match(/\s*$/)?.[0] || '';
  const key = normalizeText(original);

  if (!originals.has(node)) {
    if (!dictionary[currentKey]) return;
    originals.set(node, node.nodeValue);
  }

  const nextValue = dictionary[key] ? `${leading}${dictionary[key]}${trailing}` : original;

  if (node.nodeValue !== nextValue) {
    node.nodeValue = nextValue;
  }
};

const translateAttributes = (element, dictionary, originals) => {
  if (SKIP_TAGS.has(element.tagName) || element.closest('[data-no-native-translate], .notranslate')) return;

  TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
    if (!element.hasAttribute(attribute)) return;

    const currentValue = element.getAttribute(attribute);
    const currentKey = normalizeText(currentValue || '');
    if (!originals.has(element) && !dictionary[currentKey]) return;

    let originalAttributes = originals.get(element);
    if (!originalAttributes) {
      originalAttributes = {};
      originals.set(element, originalAttributes);
    }

    if (!originalAttributes[attribute]) {
      originalAttributes[attribute] = currentValue;
    }

    const original = originalAttributes[attribute];
    const key = normalizeText(original);
    const nextValue = dictionary[key] || original;
    if (element.getAttribute(attribute) !== nextValue) {
      element.setAttribute(attribute, nextValue);
    }
  });
};

const restoreOriginals = (textOriginals, attributeOriginals) => {
  textOriginals.current.forEach((original, node) => {
    if (node.isConnected && node.nodeValue !== original) node.nodeValue = original;
  });

  attributeOriginals.current.forEach((attributes, element) => {
    if (!element.isConnected) return;
    Object.entries(attributes).forEach(([attribute, original]) => {
      if (element.getAttribute(attribute) !== original) {
        element.setAttribute(attribute, original);
      }
    });
  });
};

const applyNativeTranslations = (root, dictionary, textOriginals, attributeOriginals) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!normalizeText(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
      return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    translateTextNode(node, dictionary, textOriginals.current);
    node = walker.nextNode();
  }

  root.querySelectorAll?.('*').forEach((element) => {
    translateAttributes(element, dictionary, attributeOriginals.current);
  });
};

const NativeDomTranslator = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const textOriginals = useRef(new Map());
  const attributeOriginals = useRef(new Map());
  const scheduledRef = useRef(false);
  const dictionary = useMemo(() => buildDictionary(language), [language]);

  useEffect(() => {
    clearLegacyGoogleTranslate();
  }, []);

  useEffect(() => {
    const run = () => {
      scheduledRef.current = false;
      if (isReactTranslatedRoute(location.pathname) || language === 'en') {
        restoreOriginals(textOriginals, attributeOriginals);
      } else {
        applyNativeTranslations(document.body, dictionary, textOriginals, attributeOriginals);
      }
    };

    run();

    const observer = new MutationObserver(() => {
      if (scheduledRef.current) return;
      scheduledRef.current = true;
      window.requestAnimationFrame(run);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES,
    });

    return () => observer.disconnect();
  }, [dictionary, language, location.pathname]);

  return null;
};

export default NativeDomTranslator;
