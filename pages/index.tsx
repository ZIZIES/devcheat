import { useState, useMemo, useEffect } from 'react'
import Head from 'next/head'
import { languages, Language, Section, Card } from '../data/languages'
import styles from '../styles/Home.module.css'

const LANG_ICONS: Record<string, string> = {
  python:'🐍', javascript:'🟨', typescript:'🔷', c:'⚙️', cpp:'🔧',
  java:'☕', kotlin:'🎯', csharp:'💜', swift:'🐦', go:'🐹',
  rust:'🦀', bash:'🖥️', html:'🌐', css:'🎨',
  php:'🐘', ruby:'💎', lua:'🌙', perl:'🐪',
  sql:'🗃️', r:'📊', scala:'⚡', dart:'🎯', powershell:'🪟',
  elixir:'💧', haskell:'λ', fsharp:'🔵', erlang:'☎️', ocaml:'🐫',
  clojure:'🔄', lisp:'🔵', zig:'⚡', nim:'👑', julia:'📐',
  matlab:'📈', x86asm:'💾', armasm:'📟', fortran:'🧮', batch:'🪟',
  machinecode:'🔩', brainfuck:'🧠', yaml:'📋',
  cobol:'🏦', toml:'⚙️', graphql:'🔮',
}

const THEMES = [
  { id: 'aero',     label: 'Frutiger Aero', color: '#3a88cc' },
  { id: 'modern',   label: 'Modern Dark',   color: '#6366f1' },
  { id: 'terminal', label: 'Terminal',       color: '#00ff41' },
  { id: 'rose',     label: 'Rose',           color: '#fb7185' },
  { id: 'sepia',    label: 'Sepia',          color: '#8b6f47' },
  { id: 'nord',     label: 'Nord',           color: '#88c0d0' },
  { id: 'sunset',   label: 'Sunset',         color: '#f97316' },
]

type Level = 'beginner' | 'intermediate' | 'advanced'

const LEVELS: { id: Level; label: string; emoji: string }[] = [
  { id: 'beginner',     label: 'Beginner',     emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', emoji: '⚡' },
  { id: 'advanced',     label: 'Advanced',     emoji: '🔥' },
]

const KEYWORDS = new Set([
  'int','float','double','char','void','bool','auto','const','static','return',
  'if','else','for','while','do','switch','case','break','continue','struct',
  'class','public','private','protected','virtual','override','namespace','using',
  'template','typename','let','var','fn','mut','pub','impl','trait','enum','match',
  'where','type','import','export','from','async','await','function','def','lambda',
  'yield','new','delete','null','nil','None','true','false','True','False','nullptr',
  'this','self','super','extends','implements','interface','abstract','sealed',
  'record','data','val','fun','object','readonly','uint8_t','int32_t','uint64_t',
  'uint32_t','size_t','constexpr','inline','extern','typedef','sizeof',
  'declare','global','local','echo','then','fi','done','do','PROGRAM','END',
  'IMPLICIT','NONE','INTEGER','REAL','LOGICAL','CHARACTER','DO','IF','THEN',
  'ELSE','SUBROUTINE','FUNCTION','CALL','PRINT','WRITE','READ','SET','ECHO',
])

type Token = { kind: 'kw'|'str'|'cm'|'plain'; text: string }

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < code.length) {
    if (code[i] === '/' && code[i+1] === '/') {
      const end = code.indexOf('\n', i)
      const text = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ kind: 'cm', text }); i += text.length; continue
    }
    if ((code[i] === '#' || code[i] === '!') && (i === 0 || /[\n ]/.test(code[i-1]))) {
      const end = code.indexOf('\n', i)
      const text = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ kind: 'cm', text }); i += text.length; continue
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1
      while (j < code.length && code[j] !== q) { if (code[j] === '\\') j++; j++ }
      tokens.push({ kind: 'str', text: code.slice(i, j+1) }); i = j+1; continue
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i
      while (j < code.length && /[\w]/.test(code[j])) j++
      const word = code.slice(i, j)
      tokens.push({ kind: KEYWORDS.has(word) ? 'kw' : 'plain', text: word }); i = j; continue
    }
    const last = tokens[tokens.length-1]
    if (last?.kind === 'plain') last.text += code[i]
    else tokens.push({ kind: 'plain', text: code[i] })
    i++
  }
  return tokens
}

function CodeBlock({ code }: { code: string }) {
  const tokens = useMemo(() => tokenize(code), [code])
  return (
    <div className={styles.codeBlock}>
      {tokens.map((t, i) => (
        <span key={i} style={{
          color: t.kind==='kw' ? 'var(--color-kw)' : t.kind==='str' ? 'var(--color-str)' : t.kind==='cm' ? 'var(--color-cm)' : 'var(--text-code)',
          fontStyle: t.kind==='cm' ? 'italic' : 'normal',
          fontWeight: t.kind==='kw' ? '600' : 'normal',
        }}>{t.text}</span>
      ))}
    </div>
  )
}

function CheatCard({ card, level }: { card: Card; level: Level }) {
  const [copied, setCopied] = useState(false)
  const data = card[level]
  const copy = () => {
    navigator.clipboard.writeText(data.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const levelColors: Record<Level, string> = {
    beginner: 'var(--color-level-beginner, #22c55e)',
    intermediate: 'var(--color-level-intermediate, #f59e0b)',
    advanced: 'var(--color-level-advanced, #ef4444)',
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardTitle}>{card.title}</span>
        <button className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`} onClick={copy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <div className={styles.cardBody}>
        {data.explanation && (
          <div className={styles.explanation}>
            {data.explanation}
          </div>
        )}
        <CodeBlock code={data.code} />
        {data.examples && data.examples.length > 0 && (
          <div className={styles.exampleBlock}>
            <div className={styles.exampleLabel}>example</div>
            {data.examples.map((ex, i) => (
              <div key={i}>
                <div className={styles.exampleInput}>{ex.input}</div>
                <div className={styles.exampleArrow}>→ output</div>
                <div className={styles.exampleOutput}>{ex.output}</div>
                {i < (data.examples?.length ?? 0) - 1 && <div style={{ margin: '4px 0', borderTop: '1px solid var(--border-example)' }} />}
              </div>
            ))}
          </div>
        )}
        {data.note && <div className={styles.note}>💡 {data.note}</div>}
      </div>
    </div>
  )
}

function LangPage({ lang, externalSearch, level }: { lang: Language; externalSearch: string; level: Level }) {
  const [activeSection, setActiveSection] = useState(lang.sections[0]?.id)
  const currentSection = lang.sections.find(s => s.id === activeSection)
  const totalCards = lang.sections.reduce((a, s) => a + s.cards.length, 0)

  const searchResults = useMemo(() => {
    if (!externalSearch.trim()) return null
    const q = externalSearch.toLowerCase()
    const results: { section: Section; card: Card }[] = []
    for (const section of lang.sections)
      for (const card of section.cards) {
        const d = card[level]
        if (card.title.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.explanation?.toLowerCase().includes(q))
          results.push({ section, card })
      }
    return results
  }, [externalSearch, lang, level])

  useEffect(() => { setActiveSection(lang.sections[0]?.id) }, [lang.id])

  return (
    <div>
      <div className={styles.breadcrumb}>Home › Languages › {lang.name}</div>
      <div className={styles.langTitle}>{lang.name} Reference</div>
      <div className={styles.langMeta}>{lang.ext} &nbsp;·&nbsp; est. {lang.year} &nbsp;·&nbsp; {totalCards} cards</div>
      {!externalSearch && (
        <div className={styles.sectionTabs}>
          {lang.sections.map(s => (
            <button key={s.id}
              className={`${styles.sectionTab} ${activeSection===s.id ? styles.sectionTabActive : ''}`}
              onClick={() => setActiveSection(s.id)}>{s.label}</button>
          ))}
        </div>
      )}
      {externalSearch ? (
        searchResults && searchResults.length > 0 ? (
          <>
            <div className={styles.resultMeta}>{searchResults.length} result{searchResults.length!==1?'s':''} for &quot;{externalSearch}&quot;</div>
            <div className={styles.cardGrid}>
              {searchResults.map(({ section, card }, i) => (
                <div key={i}>
                  <div className={styles.resultLangLabel}>§ {section.label}</div>
                  <CheatCard card={card} level={level} />
                </div>
              ))}
            </div>
          </>
        ) : <div className={styles.noResults}>no results for &quot;{externalSearch}&quot;</div>
      ) : currentSection && (
        <div className={styles.cardGrid}>
          {currentSection.cards.map((card, i) => <CheatCard key={i} card={card} level={level} />)}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [theme, setTheme] = useState('aero')
  const [level, setLevel] = useState<Level>('beginner')
  const [activeLang, setActiveLang] = useState<string | null>(null)
  const [globalSearch, setGlobalSearch] = useState('')
  const [langSearch, setLangSearch] = useState('')
  const [showObscure, setShowObscure] = useState(false)
  const currentLang = languages.find(l => l.id === activeLang)
  const totalCards = languages.reduce((a,l) => a + l.sections.reduce((b,s) => b + s.cards.length, 0), 0)

  const commonLangs = languages.filter(l => l.common)
  const obscureLangs = languages.filter(l => !l.common)

  useEffect(() => {
    const t = localStorage.getItem('devcheat-theme')
    const lv = localStorage.getItem('devcheat-level') as Level | null
    const ob = localStorage.getItem('devcheat-obscure')
    if (t) setTheme(t)
    if (lv) setLevel(lv)
    if (ob) setShowObscure(ob === 'true')
  }, [])

  const switchTheme = (id: string) => { setTheme(id); localStorage.setItem('devcheat-theme', id) }
  const switchLevel = (lv: Level) => { setLevel(lv); localStorage.setItem('devcheat-level', lv) }
  const toggleObscure = () => {
    const next = !showObscure
    setShowObscure(next)
    localStorage.setItem('devcheat-obscure', String(next))
  }

  const searchValue = activeLang ? langSearch : globalSearch
  const setSearch = (v: string) => activeLang ? setLangSearch(v) : setGlobalSearch(v)

  const currentLevelInfo = LEVELS.find(l => l.id === level)!

  return (
    <>
      <Head>
        <title>devcheat — programming reference</title>
        <meta name="description" content="programming cheat sheets with examples for every language" />
      </Head>
      <div className={styles.root} data-theme={theme}>
        <header className={styles.header}>
          <button className={styles.logo} onClick={() => { setActiveLang(null); setGlobalSearch(''); setLangSearch('') }}>
            dev<span className={styles.logoAccent}>cheat</span>
          </button>
          <button className={`${styles.navLink} ${!activeLang && !globalSearch ? styles.navLinkActive : ''}`}
            onClick={() => { setActiveLang(null); setGlobalSearch(''); setLangSearch('') }}>Home</button>
          <button className={styles.navLink}>About</button>

          <div className={styles.headerRight}>
            {/* level switcher */}
            <div className={styles.themeSwitcher}>
              <span className={styles.themeSwatchLabel}>level</span>
              <select className={styles.themeSelect} value={level} onChange={e => switchLevel(e.target.value as Level)}>
                {LEVELS.map(l => (
                  <option key={l.id} value={l.id}>{l.emoji} {l.label}</option>
                ))}
              </select>
            </div>
            {/* theme switcher */}
            <div className={styles.themeSwitcher}>
              <span className={styles.themeSwatchLabel}>theme</span>
              <select className={styles.themeSelect} value={theme} onChange={e => switchTheme(e.target.value)}>
                {THEMES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.searchWrap}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder={activeLang ? `Search ${currentLang?.name}...` : 'Search syntax...'}
                value={searchValue}
                onChange={e => setSearch(e.target.value)}
              />
              <button className={styles.searchBtn}>Search</button>
            </div>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHead}>Languages</div>
            <button className={`${styles.sidebarLink} ${!activeLang ? styles.sidebarLinkActive : ''}`}
              onClick={() => { setActiveLang(null); setGlobalSearch(''); setLangSearch('') }}>
              🏠 All
            </button>
            {commonLangs.map(lang => (
              <button key={lang.id}
                className={`${styles.sidebarLink} ${activeLang===lang.id ? styles.sidebarLinkActive : ''}`}
                onClick={() => { setActiveLang(lang.id); setGlobalSearch(''); setLangSearch('') }}>
                {LANG_ICONS[lang.id]} {lang.name}
              </button>
            ))}
            <button className={styles.showMoreBtn} onClick={toggleObscure}>
              {showObscure ? '▲ show less' : '▼ show more'}
            </button>
            {showObscure && obscureLangs.map(lang => (
              <button key={lang.id}
                className={`${styles.sidebarLink} ${activeLang===lang.id ? styles.sidebarLinkActive : ''}`}
                onClick={() => { setActiveLang(lang.id); setGlobalSearch(''); setLangSearch('') }}>
                {LANG_ICONS[lang.id]} {lang.name}
              </button>
            ))}
          </aside>

          <main className={styles.main}>
            {/* level indicator bar */}
            <div className={styles.levelBar}>
              <span className={styles.levelBadge} data-level={level}>
                {currentLevelInfo.emoji} {currentLevelInfo.label} mode
              </span>
              <span className={styles.levelHint}>
                {level === 'beginner' && 'explanations from scratch — no prior knowledge needed'}
                {level === 'intermediate' && 'assumes you know programming — focuses on this language'}
                {level === 'advanced' && 'terse — just the syntax, gotchas, and edge cases'}
              </span>
            </div>

            {activeLang ? (
              <LangPage lang={currentLang!} key={currentLang!.id} externalSearch={langSearch} level={level} />
            ) : (
              <div>
                <div className={styles.welcomeTitle}>Programming Reference</div>
                <div className={styles.welcomeSub}>
                  Cheat sheets for {languages.length} languages · {totalCards} cards · {currentLevelInfo.emoji} {currentLevelInfo.label} mode
                </div>
                <div className={styles.langGrid}>
                  {languages.map(lang => (
                    <button key={lang.id} className={styles.langTile} onClick={() => setActiveLang(lang.id)}>
                      <span className={styles.tileIcon}>{LANG_ICONS[lang.id]}</span>
                      <span className={styles.tileName}>{lang.name}</span>
                      <span className={styles.tileExt}>{lang.ext}</span>
                      <span className={styles.tileYear}>est. {lang.year}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        <footer className={styles.footer}>
          <span>devcheat.app</span>
          <span>·</span>
          <span>{languages.length} languages</span>
          <span>·</span>
          <span>{totalCards} cards</span>
          <span>·</span>
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
            {currentLevelInfo.emoji} {currentLevelInfo.label} · {THEMES.find(t => t.id === theme)?.label}
          </span>
        </footer>
      </div>
    </>
  )
}
