import { useEffect, useMemo, useRef, useState } from 'react';
import GhostFibers from './rb/GhostFibers';
import CrystalizedBall from './rb/CrystalizedBall';
import TextLoop from './rb/TextLoop';
import CircularCarousel from './rb/CircularCarousel';
import FlexCarousel from './rb/FlexCarousel';
import SideRays from './rb/SideRays';
import {
  NAV, PLATFORMS, SERVICES, BENEFITS, SHOWCASE, WORK_FILTERS, WORK, STEPS, WHY,
  PLANS, POSTS, FAQ, BIZ_TYPES, GOALS, GRID
} from './content';

/* ---------- small helpers ---------- */

const ICONS = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4M8 15h3" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  pen: <><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 7l3 3" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 10h8M8 13h5" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M7 15l4-4 3 3 5-6" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M19 12H5M11 6l-6 6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

const Icon = ({ name, size = 22 }) => (
  <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const useInView = (opts = { threshold: 0.18 }) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
};

const CountUp = ({ to, prefix = '', suffix = '', decimals = 0, run }) => {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
    let raf; const t0 = performance.now(); const d = 1600;
    const tick = now => {
      const p = Math.min(1, (now - t0) / d); const e = 1 - Math.pow(1 - p, 4);
      setV(to * e); if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <span className="num">{prefix}{v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

const Eyebrow = ({ children }) => <p className="eyebrow"><span className="eyebrow__dot" />{children}</p>;

/* ---------- header ---------- */

const Logo = () => (
  <a href="#home" className="logo" aria-label="Magmafy الرئيسية">
    <span className="logo__mark" aria-hidden="true">M</span>
    <span className="logo__word">Magmafy</span>
  </a>
);

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="header__inner">
        <Logo />
        <nav className="nav" aria-label="القائمة الرئيسية">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
        <a href="#contact" className="btn btn--grad btn--sm header__cta">ابدأ النمو</a>
        <button className="burger" aria-label="فتح القائمة" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
};

/* ---------- hero ---------- */

const GrowthChart = () => (
  <svg viewBox="0 0 260 90" className="chart" aria-hidden="true">
    <defs>
      <linearGradient id="gl" x1="0" x2="1"><stop offset="0" stopColor="#FEDA75" /><stop offset=".35" stopColor="#FA7E1E" /><stop offset=".7" stopColor="#D62976" /><stop offset="1" stopColor="#962FBF" /></linearGradient>
      <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#D62976" stopOpacity=".45" /><stop offset="1" stopColor="#D62976" stopOpacity="0" /></linearGradient>
    </defs>
    {[20, 45, 70].map(y => <line key={y} x1="0" x2="260" y1={y} y2={y} className="chart__grid" />)}
    <g transform="translate(260 0) scale(-1 1)">
    <path d="M260 78 C230 76 215 70 195 66 S160 60 140 50 S105 40 85 30 S40 16 0 6 L0 90 L260 90Z" fill="url(#ga)" />
    <path className="chart__line" d="M260 78 C230 76 215 70 195 66 S160 60 140 50 S105 40 85 30 S40 16 0 6" fill="none" stroke="url(#gl)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="0" cy="6" r="5" fill="#FEDA75" className="chart__dot" transform="translate(4 0)" />
    </g>
  </svg>
);

const Mockup = () => {
  const [ref, seen] = useInView();
  return (
    <div className="mock" ref={ref}>
      <div className="mock__phone">
        <div className="mock__top">
          <span className="mock__handle">dar.living</span>
          <span className="mock__menu" aria-hidden="true">•••</span>
        </div>
        <div className="mock__profile">
          <div className="mock__avatar"><span>DL</span></div>
          <dl className="mock__stats">
            <div><dt>منشور</dt><dd className="num">248</dd></div>
            <div><dt>متابع</dt><dd><CountUp to={86.4} decimals={1} suffix="K" run={seen} /></dd></div>
            <div><dt>يتابع</dt><dd className="num">312</dd></div>
          </dl>
        </div>
        <p className="mock__bio"><b>Dar Living</b>أثاث عصري بلمسة دافئة ✦ توصيل وتركيب مجاني</p>
        <div className="mock__actions"><span className="mock__follow">متابعة</span><span>رسالة</span></div>
        <div className="mock__grid">{GRID.map(s => <img key={s} src={s} alt="" loading="lazy" />)}</div>
      </div>

      <div className="mock__card mock__dash">
        <div className="mock__dash-head"><span>لوحة النمو</span><span className="pill">90 يومًا</span></div>
        <p className="mock__big"><CountUp to={248} prefix="+" suffix="%" run={seen} /><small>نمو في الوصول</small></p>
        <GrowthChart />
        <ul className="mock__legend"><li>التفاعل</li><li>النقرات</li><li>الاستفسارات</li></ul>
      </div>

      <div className="mock__chip chip-a"><b><CountUp to={12.4} decimals={1} prefix="+" suffix="K" run={seen} /></b><span>حفظ للمنشورات</span></div>
      <div className="mock__chip chip-b"><b><CountUp to={40} prefix="+" suffix="%" run={seen} /></b><span>زيارات المعرض هذا الشهر</span></div>
      <div className="mock__chip chip-c"><b><CountUp to={3250} prefix="+" run={seen} /></b><span>متابع جديد</span></div>
    </div>
  );
};

const Hero = () => (
  <section className="hero" id="home">
    <div className="hero__ball" aria-hidden="true">
      <CrystalizedBall preset="plasma" color="#F25BD0" size={0.7} crackle={0.85} fill={0.5} interactive hoverStrength={0.7} />
    </div>
    <div className="wrap hero__inner">
      <div className="hero__copy">
        <Eyebrow>وكالة نمو متخصصة في الأثاث والديكور</Eyebrow>
        <h1 className="hero__title">نحوّل متابعيك إلى <span className="grad">زوّار لمعرضك</span>، ومحتواك إلى <span className="grad">مبيعات</span></h1>
        <p className="hero__lede">نعمل فقط مع معارض الأثاث ومتاجر الديكور وشركات التصميم الداخلي. نصوّر قطعك كما تستحق، ونطلق إعلانات تصل إلى من يجهّز بيته الآن، ونقيس كل استفسار وزيارة وطلب.</p>
        <div className="hero__ctas">
          <a href="#contact" className="btn btn--grad">احجز استشارة مجانية <Icon name="arrow" size={18} /></a>
          <a href="#work" className="btn btn--ghost">شاهد نتائج عملائنا</a>
        </div>
        <ul className="platforms" aria-label="المنصات التي نديرها">
          {PLATFORMS.map(p => <li key={p}>{p}</li>)}
        </ul>
      </div>
      <Mockup />
    </div>
  </section>
);

/* ---------- ribbon ---------- */

const Ribbon = () => {
  const [fontKey, setFontKey] = useState(0);
  useEffect(() => { document.fonts?.ready.then(() => setFontKey(1)); }, []);
  return (
  <section className="ribbon" aria-label="لماذا تبدأ الآن">
    <a href="#contact" className="ribbon__link" aria-label="ابدأ النمو الآن: احجز استشارة مجانية">
      <TextLoop
        key={fontKey}
        text={BENEFITS}
        shape="wave"
        speed={80}
        direction="reverse"
        separator="✦"
        curviness={55}
        fontSize={44}
        fontWeight={800}
        letterSpacing={0}
        uppercase={false}
        ribbon
        ribbonColor="#D62976"
        ribbonWidth={86}
        cross
        crossColor="#FEDA75"
        crossAngle={12}
        edgeFade={0}
        pauseOnHover
      />
    </a>
    <div className="wrap ribbon__cta">
      <p>مقاعد الاستشارة المجانية لهذا الشهر محدودة. احجز مكانك قبل موسم البيع القادم.</p>
      <a href="#contact" className="btn btn--grad">احجز استشارتي الآن <Icon name="arrow" size={18} /></a>
    </div>
  </section>
  );
};

/* ---------- services ---------- */

const Services = () => (
  <section className="section" id="services">
    <div className="wrap">
      <div className="head">
        <Eyebrow>خدماتنا</Eyebrow>
        <h2>كل ما تحتاجه علامة الأثاث <span className="grad">لتبيع على السوشيال ميديا</span>، في مكان واحد</h2>
        <p>لا نبيعك منشورات، بل نربط كل خدمة بنتيجة تتابعها في تقريرك الشهري.</p>
      </div>
      <div className="services">
        {SERVICES.map((s, i) => (
          <article className="svc" key={s.title} style={{ '--i': i }}>
            <div className="svc__icon"><Icon name={s.icon} size={26} /></div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <ul className="svc__tags">{s.tags.map(t => <li key={t}>{t}</li>)}</ul>
            <p className="svc__result"><span>النتيجة</span>{s.result}</p>
          </article>
        ))}
      </div>
      <div className="center"><a href="#contact" className="btn btn--ghost">اختر خدماتك مع فريقنا</a></div>
    </div>
  </section>
);

/* ---------- showcase (circular + rays) ---------- */

const Showcase = () => (
  <section className="section showcase" id="showcase">
    <div className="rays" aria-hidden="true">
      <SideRays rayColor1="#FFC46B" rayColor2="#F25BD0" origin="top-right" speed={2.5} intensity={2} spread={2} density={5} followMouse />
    </div>
    <div className="wrap">
      <div className="head">
        <Eyebrow>نماذج المحتوى</Eyebrow>
        <h2>محتوى يجعل القطعة <span className="grad">تُحفظ وتُشارك وتُطلب</span></h2>
        <p>تصوير منتجات، جولات داخل المعرض، قبل وبعد، وتقارير أداء. اسحب الدائرة لتشاهد ما ننتجه كل شهر.</p>
      </div>
    </div>
    <div className="showcase__stage" dir="ltr">
      <CircularCarousel
        items={SHOWCASE}
        preset="cylinder"
        intro="rise"
        cardWidth={230}
        aspectRatio={0.8}
        speed={14}
        direction="right"
        cornerRadius={18}
        fadeColor="#0E0716"
        captions
      />
    </div>
  </section>
);

/* ---------- process ---------- */

const Process = () => (
  <section className="section" id="process">
    <div className="wrap">
      <div className="head">
        <Eyebrow>آلية العمل</Eyebrow>
        <h2>من الاستراتيجية إلى <span className="grad">الانتشار</span></h2>
        <p>أربع مراحل واضحة، وفي كل مرحلة تعرف ما الذي نفعله وما الذي ستستلمه.</p>
      </div>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li className="step" key={s.title}>
            <span className="step__n num">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <p className="step__out"><span>المخرَج</span>{s.out}</p>
          </li>
        ))}
      </ol>
      <div className="center"><a href="#contact" className="btn btn--grad">ابدأ من الخطوة الأولى</a></div>
    </div>
  </section>
);

/* ---------- work (flex + rays) ---------- */

const Work = () => {
  const [filter, setFilter] = useState('all');
  const [idx, setIdx] = useState(0);
  const list = useMemo(() => (filter === 'all' ? WORK : WORK.filter(w => w.cat === filter)), [filter]);
  const items = useMemo(() => list.map(w => ({ src: w.src, alt: w.title, title: w.title, subtitle: w.subtitle })), [list]);
  const cur = list[Math.min(idx, list.length - 1)] || list[0];

  return (
    <section className="section work" id="work">
      <div className="rays rays--left" aria-hidden="true">
        <SideRays rayColor1="#FFC46B" rayColor2="#96c8ff" origin="top-left" speed={2.5} intensity={2} spread={2} density={5} followMouse />
      </div>
      <div className="wrap">
        <div className="head">
          <Eyebrow>أعمالنا</Eyebrow>
          <h2>أرقام تتحرك <span className="grad">خلف كل قطعة أثاث</span></h2>
          <p>نماذج من حسابات أثاث وديكور ونتائجها المختصرة. اختر نوع نشاطك وشاهد ما يمكن أن نفعله لمثله.</p>
        </div>
        <div className="filters" role="tablist" aria-label="نوع النشاط">
          {WORK_FILTERS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={filter === id} className={filter === id ? 'is-on' : ''}
              onClick={() => { setFilter(id); setIdx(0); }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="work__stage" dir="ltr">
        <FlexCarousel
          key={filter}
          items={items}
          preset="liquid"
          intro="rise"
          cardHeight={0.56}
          gap={14}
          radius={18}
          squeeze={0.2}
          focusOnClick
          captions
          onChange={i => setIdx(i)}
        />
      </div>

      {cur && (
        <div className="wrap">
          <div className="result" key={cur.title}>
            <div className="result__label">
              <span className="pill">{cur.subtitle}</span>
              <h3>{cur.title}</h3>
              <p>{cur.note}</p>
            </div>
            <dl className="result__metrics">
              {cur.metrics.map(([n, l]) => (
                <div key={l}><dd className="num grad">{n}</dd><dt>{l}</dt></div>
              ))}
            </dl>
          </div>
          <p className="fineprint">الأرقام المعروضة نماذج توضيحية لنوع النتائج التي نقيسها.</p>
          <div className="center"><a href="#contact" className="btn btn--grad">أريد نتائج مثل هذه <Icon name="arrow" size={18} /></a></div>
        </div>
      )}
    </section>
  );
};

/* ---------- why ---------- */

const Why = () => (
  <section className="section" id="why">
    <div className="wrap why">
      <div className="why__intro">
        <Eyebrow>لماذا Magmafy؟</Eyebrow>
        <h2>لا نقيس نجاحنا بعدد المنشورات، بل <span className="grad">بما يتغيّر في أرقامك</span></h2>
        <p>كثير من الوكالات تسلّمك تقويمًا مليئًا بصور المنتجات. نحن نسلّمك مؤشرات تتحسن: زيارات للمعرض، وطلبات عروض أسعار، ومبيعات بتكلفة أقل.</p>
        <a href="#contact" className="btn btn--ghost">تحدث مع خبير</a>
      </div>
      <ul className="why__list">
        {WHY.map(([t, b]) => (
          <li key={t}>
            <span className="why__tick"><Icon name="check" size={18} /></span>
            <div><h3>{t}</h3><p>{b}</p></div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ---------- pricing ---------- */

const Pricing = () => (
  <section className="section" id="pricing">
    <div className="wrap">
      <div className="head">
        <Eyebrow>باقاتنا</Eyebrow>
        <h2>باقة تُفصَّل على <span className="grad">حجم طموحك</span></h2>
        <p>لا أسعار جامدة. نحدد معك النطاق المناسب لهدفك وميزانيتك، ونرسل عرضًا واضحًا خلال 48 ساعة عمل.</p>
      </div>
      <div className="plans">
        {PLANS.map(p => (
          <article key={p.name} className={`plan ${p.featured ? 'plan--hot' : ''}`}>
            {p.featured && <span className="plan__badge">الأكثر طلبًا</span>}
            <h3>{p.name}</h3>
            <p className="plan__for">{p.for}</p>
            <p className="plan__price">عرض مخصص</p>
            <ul>{p.items.map(it => <li key={it}><Icon name="check" size={16} />{it}</li>)}</ul>
            <a href="#contact" className={`btn ${p.featured ? 'btn--light' : 'btn--ghost'}`}>اطلب عرضًا مخصصًا</a>
          </article>
        ))}
      </div>
      <p className="center muted">تحتاج شيئًا مختلفًا؟ نركّب لك باقة من الخدمات التي تناسبك فقط.</p>
    </div>
  </section>
);

/* ---------- about ---------- */

const About = () => (
  <section className="section" id="about">
    <div className="wrap about">
      <div className="about__media">
        <img src="img/camera.jpg" alt="معدات تصوير المنتجات" className="about__a" loading="lazy" />
        <img src="img/living-boho.jpg" alt="صالة معرض أثاث" className="about__b" loading="lazy" />
        <img src="img/dashboard.jpg" alt="لوحة تحليل الأداء" className="about__c" loading="lazy" />
        <ul className="about__orbit" aria-hidden="true"><li>تصوير</li><li>إعلانات</li><li>تحليل</li><li>مجتمع</li></ul>
      </div>
      <div className="about__copy">
        <Eyebrow>من نحن</Eyebrow>
        <h2>فريق صغير الحجم، <span className="grad">كبير الأثر</span></h2>
        <p>Magmafy وكالة عربية متخصصة في قطاع الأثاث والديكور، وُلدت من قناعة واحدة: قطعة الأثاث تُشترى بالعين أولًا، والسوشيال ميديا هي أول معرض يدخله عميلك اليوم.</p>
        <p>يجمع فريقنا مصورين ومصممين وكتّاب محتوى وخبراء إعلانات ومحللين يعملون كفريق تسويق داخلي لعلامتك. نفهم ذوق جمهورك ومواسم شرائه وأسئلته قبل أن يزور معرضك، ونقيس كل خطوة.</p>
        <dl className="values">
          <div><dt>إبداع</dt><dd>محتوى يُبرز جمال قطعك</dd></div>
          <div><dt>أرقام</dt><dd>قرارات تستند إلى البيانات</dd></div>
          <div><dt>شراكة</dt><dd>نربح عندما تربح</dd></div>
        </dl>
      </div>
    </div>
  </section>
);

/* ---------- blog ---------- */

const Blog = () => (
  <section className="section" id="blog">
    <div className="wrap">
      <div className="head head--row">
        <div>
          <Eyebrow>المدونة</Eyebrow>
          <h2>أفكار تساعدك على <span className="grad">النمو</span></h2>
        </div>
        <p>مقالات عملية قصيرة من تجارب حقيقية في تسويق الأثاث والديكور.</p>
      </div>
      <div className="posts">
        {POSTS.map(p => (
          <article className="post" key={p.title}>
            <div className="post__img"><img src={p.img} alt="" loading="lazy" /><span className="pill">{p.tag}</span></div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <span className="post__meta">قراءة في {p.mins} دقائق</span>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- faq ---------- */

const Faq = () => (
  <section className="section" id="faq">
    <div className="wrap faq">
      <div className="faq__intro">
        <Eyebrow>الأسئلة الشائعة</Eyebrow>
        <h2>أجوبة <span className="grad">قبل أن تسأل</span></h2>
        <p>لم تجد إجابتك؟ اكتب لنا وسنرد عليك في نفس يوم العمل.</p>
        <a href="#contact" className="btn btn--ghost">اسألنا مباشرة</a>
      </div>
      <div className="faq__list">
        {FAQ.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}<span className="faq__plus"><Icon name="plus" size={18} /></span></summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- contact ---------- */

const Contact = () => {
  const [plats, setPlats] = useState([]);
  const [sent, setSent] = useState(false);
  const toggle = p => setPlats(cur => (cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p]));
  return (
    <section className="section contact" id="contact">
      <div className="wrap contact__grid">
        <div className="contact__copy">
          <Eyebrow>ابدأ الآن</Eyebrow>
          <h2>حان وقت أن تصبح علامتك <span className="grad">حديث كل من يجهّز بيته</span></h2>
          <p>أخبرنا عن معرضك أو متجرك وهدفك، وسنعود إليك باستشارة مجانية وخطوات أولى واضحة، دون التزام.</p>
          <ul className="contact__promise">
            <li><Icon name="check" size={18} />مراجعة مجانية لحساباتك الحالية</li>
            <li><Icon name="check" size={18} />عرض مخصص خلال 48 ساعة عمل</li>
            <li><Icon name="check" size={18} />رد في نفس يوم العمل</li>
          </ul>
        </div>

        <form className="form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          {sent ? (
            <div className="form__done" role="status">
              <span className="form__done-icon"><Icon name="check" size={30} /></span>
              <h3>وصلنا طلبك</h3>
              <p>سيتواصل معك أحد خبرائنا في نفس يوم العمل لتحديد موعد الاستشارة.</p>
              <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>إرسال طلب آخر</button>
            </div>
          ) : (
            <>
              <h3>احجز استشارتك المجانية</h3>
              <div className="form__row">
                <label htmlFor="f-name">الاسم<input id="f-name" required autoComplete="name" placeholder="اسمك الكامل" /></label>
                <label htmlFor="f-biz">اسم النشاط التجاري<input id="f-biz" required placeholder="مثال: دار ليفينج" /></label>
              </div>
              <div className="form__row">
                <label htmlFor="f-type">نوع النشاط
                  <select id="f-type" required defaultValue="">
                    <option value="" disabled>اختر نوع النشاط</option>
                    {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label htmlFor="f-contact">رقم الجوال أو البريد الإلكتروني<input id="f-contact" required placeholder="05xxxxxxxx" /></label>
              </div>
              <fieldset className="form__chips">
                <legend>المنصات الحالية</legend>
                {[...PLATFORMS, 'لا يوجد بعد'].map(p => (
                  <button type="button" key={p} aria-pressed={plats.includes(p)} onClick={() => toggle(p)}>{p}</button>
                ))}
              </fieldset>
              <label htmlFor="f-goal">الهدف التسويقي
                <select id="f-goal" required defaultValue="">
                  <option value="" disabled>اختر هدفك الأهم</option>
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </label>
              <label htmlFor="f-msg">الرسالة<textarea id="f-msg" rows="3" placeholder="حدثنا عن معرضك ومنتجاتك وما تريد تحقيقه" /></label>
              <button type="submit" className="btn btn--grad btn--block">أرسل طلبي <Icon name="arrow" size={18} /></button>
              <p className="form__note">بياناتك محفوظة لدينا ولن نشاركها مع أي جهة.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

/* ---------- footer ---------- */

const Footer = () => {
  const [ok, setOk] = useState(false);
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>وكالة نمو عبر السوشيال ميديا متخصصة في الأثاث والديكور. نحوّل المتابعين إلى زوّار وعملاء بالمحتوى والإعلانات وبناء المجتمع.</p>
        </div>
        <div>
          <h4>روابط سريعة</h4>
          <ul>{NAV.map(([id, l]) => <li key={id}><a href={`#${id}`}>{l}</a></li>)}<li><a href="#contact">تواصل معنا</a></li></ul>
        </div>
        <div>
          <h4>تواصل معنا</h4>
          <ul className="footer__contact"><li>hello@magmafy.com</li><li dir="ltr">+966 5X XXX XXXX</li></ul>
        </div>
        <div>
          <h4>النشرة البريدية</h4>
          <p>نصائح عملية لتسويق الأثاث والديكور مرة واحدة في الشهر. بلا إزعاج.</p>
          {ok ? <p className="footer__ok">تم اشتراكك، أهلًا بك.</p> : (
            <form className="news" onSubmit={e => { e.preventDefault(); setOk(true); }}>
              <label htmlFor="f-news" className="sr">البريد الإلكتروني</label>
              <input id="f-news" type="email" required placeholder="بريدك الإلكتروني" />
              <button className="btn btn--grad btn--sm">اشترك</button>
            </form>
          )}
        </div>
      </div>
      <div className="wrap footer__bottom">
        <p>© 2026 Magmafy. جميع الحقوق محفوظة.</p>
        <ul><li><a href="#home">سياسة الخصوصية</a></li><li><a href="#home">الشروط والأحكام</a></li><li><a href="#home">سياسة ملفات الارتباط</a></li></ul>
      </div>
    </footer>
  );
};

/* ---------- app ---------- */

export default function App() {
  return (
    <>
      <div className="bg" aria-hidden="true">
        <GhostFibers glowColor="#c13584" secondaryColor="#FA7E1E" layers={3} twist={1.2} threads={72} fiberStyle="dots"
          depthOfField={0.85} hoverEffect="focus" intro mouseInteraction pulseOnClick={false} />
      </div>
      <div className="bg-veil" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Ribbon />
        <Services />
        <Showcase />
        <Process />
        <Work />
        <Why />
        <Pricing />
        <About />
        <Blog />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <a href="#contact" className="fab">احجز استشارة مجانية</a>
    </>
  );
}
