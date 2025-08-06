import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Tag, Link as LinkIcon, ChevronDown, Sparkles, Star, Info } from 'lucide-react';
import './FAQ.css';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: 'Général' | 'Comparaison' | 'Sécurité';
  tags?: string[];
  updatedAt?: string;
  isNew?: boolean;
  isPopular?: boolean;
};

type Content = {
  title: string;
  subtitle: string;
  badge: string;
  searchPlaceholder: string;
  searchAria: string;
  clearLabel: string;
  categoriesLabel: string;
  emptyTitle: string;
  emptyDesc: string;
  ctaText: string;
  ctaHint: string;
};

const content: Content = {
  title: 'Foire aux questions',
  subtitle: "Trouvez rapidement des réponses. Filtrez par thème ou recherchez une question précise.",
  badge: 'Aide & Support',
  searchPlaceholder: 'Rechercher une question…',
  searchAria: 'Rechercher dans la FAQ',
  clearLabel: 'Effacer la recherche',
  categoriesLabel: 'Catégories',
  emptyTitle: 'Aucun résultat',
  emptyDesc: "Essayez avec d’autres mots-clés ou parcourez les catégories ci-dessous.",
  ctaText: 'Contacter le support',
  ctaHint: 'Notre équipe vous répond rapidement'
};

const DATA: FAQItem[] = [
  {
    id: 'q1',
    question: "Qu'est-ce que NOLI ?",
    answer: "NOLI est un comparateur d’assurances en Côte d’Ivoire. Il vous aide à trouver la couverture adaptée à votre profil au meilleur prix.",
    category: 'Général',
    tags: ['noli', 'présentation'],
    isPopular: true
  },
  {
    id: 'q2',
    question: 'Comment fonctionne la comparaison ?',
    answer: "Renseignez votre profil et vos besoins, nous agrégeons les offres et vous présentons les plus pertinentes selon le prix et les garanties.",
    category: 'Comparaison',
    tags: ['devis', 'offres']
  },
  {
    id: 'q3',
    question: 'Le service est-il gratuit ?',
    answer: 'Oui, la comparaison et la demande de devis sont 100% gratuites et sans engagement.',
    category: 'Général',
    tags: ['tarifs'],
    isPopular: true
  },
  {
    id: 'q4',
    question: 'Comment souscrire à une assurance ?',
    answer: "Après comparaison, vous pouvez demander une mise en relation pour finaliser votre souscription auprès de l’assureur choisi.",
    category: 'Comparaison',
    tags: ['souscription'],
    updatedAt: '2025-07-01',
  },
  {
    id: 'q5',
    question: 'Mes données sont-elles sécurisées ?',
    answer: "Oui. Vos informations sont chiffrées et traitées conformément aux bonnes pratiques de sécurité. Elles ne sont jamais partagées sans votre accord.",
    category: 'Sécurité',
    tags: ['données', 'confidentialité'],
    isNew: true
  },
  {
    id: 'q6',
    question: 'Puis-je modifier mes informations après envoi ?',
    answer: "Oui, vous pouvez reprendre votre demande à tout moment pour ajuster vos informations avant de finaliser la souscription.",
    category: 'Général',
    tags: ['profil', 'formulaire']
  }
];

const CATEGORIES = ['Tous', 'Général', 'Comparaison', 'Sécurité'] as const;
type Category = typeof CATEGORIES[number];

function useDebounced<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${safe})`, 'ig');
  return text.split(re).map((part, i) =>
    re.test(part) ? <mark key={i} className="faq-mark">{part}</mark> : part
  );
}

const FAQHeader = () => (
  <header className="faq-hero" role="banner" aria-label="En-tête de la foire aux questions">
    <div className="faq-hero-badge">{content.badge}</div>
    <h1 className="faq-hero-title">{content.title}</h1>
    <p className="faq-hero-desc">{content.subtitle}</p>
  </header>
);

const FAQSearch = ({
  value,
  onChange,
  onClear
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) => (
  <div className="faq-search" role="search">
    <Search className="faq-search-icon" size={18} aria-hidden />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={content.searchPlaceholder}
      aria-label={content.searchAria}
      className="faq-search-input"
      type="search"
      autoComplete="off"
    />
    {value && (
      <button className="faq-search-clear" onClick={onClear} aria-label={content.clearLabel}>
        <X size={16} />
      </button>
    )}
  </div>
);

const FAQCategories = ({
  active,
  onChange
}: {
  active: Category;
  onChange: (c: Category) => void;
}) => (
  <div className="faq-cats-wrapper" aria-label={content.categoriesLabel}>
    <div role="tablist" aria-label={content.categoriesLabel} className="faq-cats">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          role="tab"
          aria-selected={active === c}
          className={`faq-cat ${active === c ? 'active' : ''}`}
          onClick={() => onChange(c)}
        >
          <Tag size={14} aria-hidden /> {c}
        </button>
      ))}
    </div>
  </div>
);

const FAQItemRow = ({
  item,
  isOpen,
  onToggle,
  query
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  query: string;
}) => {
  const contentId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.style.maxHeight = ref.current.scrollHeight + 'px';
    } else if (ref.current) {
      ref.current.style.maxHeight = '0px';
    }
  }, [isOpen, item.answer]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
      // Navigation Up/Down gérée par le conteneur parent si besoin
    },
    [onToggle]
  );

  return (
    <article className={`faq-item ${isOpen ? 'open' : ''}`} aria-labelledby={buttonId}>
      <div className="faq-item-header">
        {item.isPopular && <span className="faq-badge faq-badge-pop"><Star size={12} aria-hidden /> Populaire</span>}
        {item.isNew && <span className="faq-badge faq-badge-new"><Sparkles size={12} aria-hidden /> Nouveau</span>}
        {item.updatedAt && <span className="faq-badge faq-badge-upd"><Info size={12} aria-hidden /> Mis à jour</span>}
      </div>
      <h3 className="sr-only">{item.question}</h3>
      <button
        id={buttonId}
        className="faq-question"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        onKeyDown={onKeyDown}
      >
        <span className="faq-question-text">{highlight(item.question, query)}</span>
        <span className={`faq-arrow ${isOpen ? 'open' : ''}`} aria-hidden>
          <ChevronDown size={18} />
        </span>
      </button>

      <div
        id={contentId}
        className="faq-answer-wrapper"
        role="region"
        aria-labelledby={buttonId}
        ref={ref}
      >
        <div className="faq-answer">{highlight(item.answer, query)}</div>

        <div className="faq-item-actions">
          <a
            href={`#${item.id}`}
            className="faq-link-anchor"
            onClick={(e) => {
              e.preventDefault();
              // copie ancre dans le presse-papier
              const url = `${window.location.pathname}?id=${encodeURIComponent(item.id)}${window.location.search ? '' : ''}#${item.id}`;
              navigator.clipboard?.writeText(url).catch(() => {});
            }}
            aria-label="Copier le lien de cette question"
            title="Copier le lien"
          >
            <LinkIcon size={14} /> Copier le lien
          </a>
        </div>
      </div>
      <span id={item.id} className="faq-anchor" aria-hidden />
    </article>
  );
};

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="faq-empty">
    <h3 className="faq-empty-title">{content.emptyTitle}</h3>
    <p className="faq-empty-desc">{content.emptyDesc}</p>
    <button className="faq-empty-reset" onClick={onReset}>Réinitialiser la recherche</button>
  </div>
);

const FAQCTA = () => (
  <div className="faq-cta">
    <a href="mailto:support@noli.ci" className="faq-cta-btn">
      {content.ctaText}
      <span className="faq-cta-kbd" aria-hidden>⏎</span>
    </a>
    <div className="faq-cta-hint">{content.ctaHint}</div>
  </div>
);

const FAQ = () => {
  const [category, setCategory] = useState<Category>('Tous');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  // Deep-linking initial (?q=, ?cat=, ?id=)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('q') || '';
    const cat = (sp.get('cat') as Category) || 'Tous';
    const id = sp.get('id');
    if (q) setQuery(q);
    if (CATEGORIES.includes(cat)) setCategory(cat);
    if (id) setOpenId(id);
  }, []);

  // Persist catégorie
  useEffect(() => {
    try {
      localStorage.setItem('faq_active_category', category);
    } catch (err) {
      // stockage non disponible (mode privé, sandbox, etc.)
      void err;
    }
  }, [category]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('faq_active_category') as Category | null;
      if (saved && CATEGORIES.includes(saved)) setCategory(saved);
    } catch (err) {
      // lecture stockage non disponible
      void err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedQuery = useDebounced(query, 200);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const byCat = (item: FAQItem) => category === 'Tous' || item.category === category;
    if (!q) return DATA.filter(byCat);
    // fuzzy simple: inclure si chaque terme de la recherche existe dans question ou réponse
    const terms = q.split(/\s+/).filter(Boolean);
    return DATA.filter((it) => {
      if (!byCat(it)) return false;
      const hay = (it.question + ' ' + it.answer + ' ' + (it.tags || []).join(' ')).toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [debouncedQuery, category]);

  const onClear = useCallback(() => setQuery(''), []);

  const onKeyDownList = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const ids = filtered.map((f) => f.id);
    const idx = openId ? ids.indexOf(openId) : -1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = ids[Math.min(idx + 1, ids.length - 1)] || ids[0];
      setOpenId(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = ids[Math.max(idx - 1, 0)] || ids[ids.length - 1];
      setOpenId(prev);
    }
  }, [filtered, openId]);

  return (
    <div className="faq-bg">
      <FAQHeader />
      <main className="faq-container" role="main">
        <div className="faq-controls">
          <FAQSearch value={query} onChange={setQuery} onClear={onClear} />
          <FAQCategories active={category} onChange={setCategory} />
        </div>

        <section className="faq-list" role="list" onKeyDown={onKeyDownList} aria-live="polite">
          {filtered.length === 0 ? (
            <EmptyState onReset={() => { setQuery(''); setCategory('Tous'); }} />
          ) : (
            filtered.map((item) => (
              <FAQItemRow
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                query={debouncedQuery}
              />
            ))
          )}
        </section>

        <FAQCTA />
      </main>
    </div>
  );
};

export default FAQ;