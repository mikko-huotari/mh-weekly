// W19-2026 — 4 to 10 May 2026
// Each entry: { outlet, title, date, url, bullets: [[lead, rest], ...] }
// A 'note' field on a section renders a short editor note in italic at the top.
// A 'group' on a section gives sub-grouping (e.g. "GER", "Europe/EU", "G7").

window.W19_2026 = {
  id: "W19-2026",
  week: 19,
  year: 2026,
  dateRange: "4 – 10 May 2026",
  pdf: "pdfs/W19-2026.pdf",
  spotlight: {
    title: "Spotlight: US-China Summit",
    intro: "Two op-eds and a podcast this week, all pointing the same way: staged optics over a strategic reset.",
    items: [
      {
        kind: "byline",
        outlet: "FAZ — op-ed",
        title: "\u201cKalk\u00fcl, kein Kurswechsel\u201d",
        date: "2026-05-07",
        url: "https://www.faz.net/premium/weltwirtschaft/weltwissen/peking-und-donald-trump-kalkuel-statt-kurswechsel-accg-200803633.html",
        bullets: [
          ["The summit will deliver optics, not reset:", "Expect a staged tariff/Boeing/agriculture landing zone but no strategic course-change. Both sides are buying time."],
          ["Three trends are accelerating underneath:", "managed trade plus tech bifurcation; the entanglement of Taiwan, Iran and Ukraine; and Beijing hardening its system for prolonged confrontation."],
          ["Europe\u2019s problem is implementation, not analysis:", "The toolkit exists. The political will to use it does not."]
        ]
      },
      {
        kind: "byline",
        outlet: "NZZ — interview",
        title: "\u201cZwei schw\u00e4chelnde Giganten\u201d",
        date: "2026-05-10",
        url: "https://www.nzz.ch/international/wir-haben-es-mit-zwei-schwaechelnden-giganten-zu-tun-ein-china-experte-ueber-den-gipfel-bei-dem-fuer-trump-und-xi-viel-auf-dem-spiel-steht-ld.10006209",
        bullets: [
          ["Beijing arrives with the stronger hand:", "Resilience built up, Washington distracted by the Iran war, and Xi willing to offer only cosmetic gestures on Iran, Russia and LNG/soybeans."],
          ["A decade of two simultaneously weakening giants:", "2040 power will be defined by control over energy (China), compute (US ahead) and finance (US dominant)."],
          ["Europe\u2019s room to manoeuvre depends on building its own model:", "Not chasing the triad. Anything else is rent-seeking on someone else\u2019s strategic capacity."]
        ]
      },
      {
        kind: "byline",
        outlet: "MERICS — Future China Conversation",
        title: "Wang Jisi (PKU) on US\u2013China relations",
        date: "2026-05-08",
        url: "#",
        bullets: [
          ["A long-form sit-down with one of China\u2019s most senior IR scholars:", "We trace the trajectory of the relationship into the summit and the global implications thereof."]
        ]
      },
      {
        kind: "byline",
        outlet: "MERICS — China in 26 podcast",
        title: "Supply-chain regulations and a Trump\u2013Xi outlook",
        date: "2026-05-09",
        url: "https://merics.org/en/podcast/china-2026-new-supply-chain-regulations-outlook-trump-xi-meeting",
        bullets: [
          ["Claudia Wessling, Katja Drinhausen and I", "talk through China\u2019s new supply-chain regulations and what to expect on May 14\u201315."]
        ]
      },
      {
        kind: "byline",
        outlet: "MERICS — online briefing",
        title: "The Trump\u2013Xi Summit, with Jacob Gunter and Helena Legarda",
        date: "Tue 12 May, 09:00 CEST",
        url: "https://merics.org/en/Press_Briefing_Trump_Xi_Summit",
        bullets: [
          ["Registration is open.", "A 30-minute live read on the summit\u2019s opening day with two of our economic-security and security colleagues."]
        ]
      }
    ]
  },
  contextSections: [
    {
      label: "German China policy in context",
      groups: [
        {
          label: "GER",
          items: [
            { outlet: "Bloomberg", date: "2026-05-09", url: "#",
              note: "CN calls on GER to stem \u201cEU drift toward protectionism\u201d during video conference with Minister Reiche, who will visit China end of the month (26\u201329 May to Beijing and Guangzhou, while the EU Commission debates China policy)." },
            { outlet: "DIHK", date: "2026-05-08", url: "#",
              note: "New report by German Chamber of Commerce (DIHK) finds that handling of CN end-use declarations and the challenges associated with export license applications for exports to CN constitute the primary advisory topics, while delivery times for critical raw materials / rare earths from CN is gaining importance. (DIHK Au\u00dfenwirtschaftsreport 2026)" },
            { outlet: "Business Insider", date: "2026-05-06", url: "#",
              note: "ENBW (largest provider of fast EV charging in GER) cooperates with CN supplier Xcharge in critical infrastructure." }
          ]
        },
        {
          label: "Europe/EU",
          items: [
            { outlet: "SCMP", date: "2026-05-07", url: "#",
              note: "\u201cChina\u2013EU investment deal should stay in deep freezer\u201d \u2014 outgoing \u201ctrade chief\u201d S. Weyand." },
            { outlet: "POLITICO", date: "2026-05-06", url: "#",
              note: "BEL urges EU (again) to save industry by getting tough on China." },
            { outlet: "Reuters", date: "2026-05-08", url: "#",
              note: "SWE arrests CN captain of suspected Russia-linked vessel." },
            { outlet: "heise", date: "2026-05-09", url: "#",
              note: "IRL data protection authorities investigate Shein over data transfer to CN." },
            { outlet: "SCMP", date: "2026-05-05", url: "#",
              note: "Lobbying report by China Chamber of Commerce to the EU (CCCEU) and KPMG uses scare numbers (430bn USD) to project cost of barring CN suppliers due to new EU Cybersecurity Act." },
            { outlet: "Brussels Teahouse / ICES", date: "2026-05-08", url: "#",
              note: "Renewed Chinese efforts to shape the information environment in Brussels: (1) Brussels Teahouse Substack newsletter; (2) Upgraded presence of ICES (Institute for China\u2013Europe Studies)." },
            { outlet: "Social Europe", date: "2026-05-07", url: "#",
              note: "Social democratic think tank / publisher doubles down on China overcapacity problem (related INTA study)." },
            { outlet: "EEAS", date: "2026-05-09", url: "#",
              note: "Europe Day and EU delegation reception + EU\u2013China Think Tank Dialogue and 2nd conference on EU\u2013China relations in China (featuring our colleague Bernhard Bartsch): Amb. Toledo hosted 1,000+ guests incl. VFM Hua Chunying and from 27 EU member states, conference tomorrow." },
            { outlet: "Euractiv", date: "2026-05-09", url: "#",
              note: "\u201cThe Ring\u201d debate features S&D (cautioning against escalation) and EPP (warning about power shift) MEPs to discuss EU trade policy." }
          ]
        },
        {
          label: "G7 and global context",
          items: [
            { outlet: "US News", date: "2026-05-08", url: "#",
              note: "G7 trade ministers meet in Paris (ahead of G7 leaders\u2019 Summit in June). Communiqu\u00e9 focus was on critical minerals. There is broad agreement on the need to reduce reliance on CN, but significant differences about how to do so; meeting overshadowed by renewed US threats to raise EU auto tariffs from 15% to 25%." },
            { outlet: "Reuters", date: "2026-05-07", url: "#",
              note: "US revises UN resolution on Iran but CN, RU still expected to veto." },
            { outlet: "Climate Action", date: "2026-05-09", url: "#",
              note: "EU, Brazil and CN launch coalition to boost integrity and effectiveness of carbon markets." }
          ]
        }
      ]
    }
  ],
  researchSections: [
    {
      label: "MERICS research and (media) insights",
      groups: [
        {
          label: "Publications",
          note: "Last week\u2019s China Essentials covered the resumption of Chinese fuel exports, Beijing\u2019s blocking of US oil sanctions, and emission quotas for local cadres.",
          items: [
        { outlet: "Jacob Gunter", title: "On fuel exports", date: "MERICS China Essentials", url: "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
          bullets: [
            ["Beijing is still restricting fuel exports to Asia, but by allowing the resumption of some shipments, it is helping keep afloat regional economies with which China is closely interdependent \u2014 and gaining influence in the region.", "Desperate Asian governments will take all the fuel they can secure from China. The crisis will increase pressure on them to strengthen national energy resilience via diversification or onshoring of refining capacity."]
          ]},
        { outlet: "Helena Legarda", title: "On the blocking statute and Iranian oil", date: "MERICS China Essentials", url: "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
          bullets: [
            ["Beijing is once again showing that even potential geopolitical or economic costs will not deter it from putting its national interests and grand strategic ambitions first.", "China\u2019s teapot refiners ensure a steady flow of cut-price oil, and Beijing is willing to risk confrontation with Washington to maintain it \u2014 and to show it will stand firm against any assertion of US long-arm jurisdiction."]
          ]},
        { outlet: "Johanna Krebs", title: "On binding emission quotas for cadres", date: "MERICS China Essentials", url: "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
          bullets: [
            ["Integrating binding emission quotas into the local cadre evaluation system is meant to show China is serious about peak emissions by 2030, by incentivising local officials to implement national climate policy.", "But the actual degree of ambition remains unclear: only when ministries publish detailed targets will we know whether this is symbolic or a genuine hands-on transformation."]
          ]},
        { outlet: "Wendy Chang", title: "On AI-driven employment shocks", date: "MERICS China Essentials", url: "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
          bullets: [
            ["China\u2019s early moves show it is aware of the changes AI will bring, and is likely to demand more from its businesses in shouldering the responsibility.", "With aggressive AI investment and a massive labour force already facing unemployment, China will have little choice but to be an early example in tackling AI-driven job loss."]
          ]},
        { outlet: "Soapbox \u00d7 MERICS", title: "Issue 246: trade exposures and IP flows", date: "2026-05-08", url: "https://soapboxtrade.substack.com/p/taiwans-export-map-tilts-toward-the",
          bullets: [
            ["Six charts for the week:", "Taiwan\u2019s export map tilts toward the US; Bratislava feels the chill of China\u2019s car slowdown; China bought what it could from ASML; China still dominates EU smartphone imports; EU agri-food exports to China could return to 2017 (pre-ASF) levels in 2026; China is earning more from IP, but the US remains far ahead."]
          ]}
          ]
        },
        {
          label: "Media Insights",
          items: [
        { outlet: "Straits Times", title: "Embodied-AI report cited in \u2018robo-cops\u2019 piece", date: "2026-05-06", url: "https://www.straitstimes.com/asia/east-asia/could-robo-cops-replace-some-traffic-police-in-china",
          bullets: [
            ["The Strait Times cited our recent report on embodied AI.", ""]
          ]},
        { outlet: "BBC", title: "Asia Specific: Wendy Chang on the unwound Manus deal", date: "2026-05-07", url: "https://www.bbc.com/audio/play/p0njks30",
          bullets: [
            ["Wendy Chang on BBC's Asia Specific podcast:", "the unwound Manus deal and the intensifying US\u2013China AI rivalry."]
          ]},
        { outlet: "Straits Times", title: "Claus Soong on China\u2019s Taiwan strategy in the run-up to the summit", date: "2026-05-08", url: "https://www.straitstimes.com/asia/east-asia/ahead-of-trump-xi-summit-beijing-puts-taiwan-front-and-centre-but-will-us-make-any-concessions",
          bullets: [
            ["The Strait Times asked Claus Soong:", "on China\u2019s strategy with regards to Taiwan in the run-up to the Trump\u2013Xi summit."]
          ]},
        { outlet: "SCMP", title: "Helena Legarda on export controls complicating EU\u2013China ties", date: "2026-05-08", url: "https://www.scmp.com/news/china/diplomacy/article/3352351/two-worlds-collide-regulatory-battlefield-hanging-over-eus-ties-china",
          bullets: [
            ["SCMP quoted Helena Legarda:", "on increasing export control and regulations complicating EU\u2013China ties."]
          ]}
          ]
        }
      ]
    }
  ],
  numberedSections: [
    {
      slug: "debates",
      short: "CN debates",
      label: "CN debates / views corner",
      note: "Sources selected by relative prominence on the Aisixiang platform over the past two weeks.",
      items: [
        { outlet: "Zhang Ying (BFSU)", title: "\u201cTheoretical Connotation, Practical Exploration, and Prospects of Building a Community of Common Destiny with Neighboring Countries\u201d", date: "2026-05-09", url: "https://www.aisixiang.com/data/175488.html",
          bullets: [
            ["A doctrinal write-up of Xi\u2019s post-2025 periphery framework:", "the 2025 Central Conference on Work Relating to Neighboring Countries, the \u201cfive homes\u201d vision, the amity-security-prosperity-sincerity-inclusiveness-shared-destiny principles, BRI as platform, and an \u201cAsian security model\u201d of shared security and dialogue."],
            ["An operational checklist for a China-led Asian order:", "head-of-state diplomacy as lead instrument, resilient regional supply chains, new security cooperation models, people-to-people exchanges \u2014 each a building block toward an Asia organised on Chinese terms."]
          ]},
        { outlet: "Zhou Fangyin (SYSU)", title: "\u201cTrump 2.0: US foreign-strategy adjustments and their impact on China\u2019s periphery\u201d", date: "2026-05-09", url: "https://www.aisixiang.com/data/175541.html",
          bullets: [
            ["On balance, a net win for China\u2019s periphery:", "US focus has shifted to the homeland and Western Hemisphere; investment in China\u2019s neighbourhood has fallen; confrontation with Asia-Pacific allies has eased."],
            ["Coercion and ally reshaping are wrecking US standing in Asia:", "opens space for deeper Chinese economic integration with affected neighbours."]
          ]},
        { outlet: "Lin Yifu (former World Bank chief economist)", title: "\u201cThe US will accept China\u2019s rise when China\u2019s per-capita GDP reaches half the US level\u201d", date: "2026-05-02", url: "https://www.aisixiang.com/data/175484.html",
          bullets: [
            ["For Lin, US acceptance is a matter of time, not negotiation:", "at the Wuzhen 15FYP salon, he argues US strategic accommodation follows automatically once China hits roughly half US per-capita GDP \u2014 turning the rivalry into demographic arithmetic."],
            ["The West is heading into a \u201cLost 20 Years\u201d:", "he cites the 28 Feb 2026 US\u2013Israel strike on Iran, the Russia\u2013Ukraine war and Gaza as evidence of accelerating Western decline, and positions the 15FYP as the plan that keeps China compounding through it."]
          ]}
      ]
    },
    {
      number: "1",
      slug: "econ",
      short: "Econ",
      label: "Domestic economic situation and policy",
      items: [
        { outlet: "Caixin", title: "\u201cWhy China needs a world-class service sector\u201d", date: "2026-05-05", url: "https://www.caixinglobal.com/2026-05-05/opinion-why-china-needs-a-world-class-service-sector-102440706.html",
          bullets: [
            ["State Council unveils 20 measures to push services past 100 trillion yuan by 2030:", "the policy targets institutional barriers, pushing producer services toward high-end specialisation and consumer services toward eldercare and childcare."],
            ["Services already drove 61.4% of growth in 2025:", "the sector employs roughly half the workforce."]
          ]},
        { outlet: "Trivium", title: "\u201cBeijing wants SOEs to invest in private tech companies\u201d", date: "2026-05-08", url: "https://triviumchina.com/2026/05/08/beijing-wants-soes-to-invest-in-private-tech-companies",
          bullets: [
            ["A revised SOE assets law would steer state capital into private tech:", "the 30 April draft \u2014 updating a 2009 law \u2014 would require SOEs to take minority equity stakes in private technology companies."],
            ["109 articles, 32 of them new:", "released for public comment by the legislature and currently under review."]
          ]},
        { outlet: "The Economist", title: "\u201cDeepSeek and Alibaba rescue China\u2019s office landlords\u201d", date: "2026-05-07", url: "https://www.economist.com/finance-and-economics/2026/05/07/deepseek-and-alibaba-rescue-chinas-office-landlords",
          bullets: [
            ["A Hangzhou court has barred firms from replacing staff with AI:", "the late-April ruling protects employment in China\u2019s AI capital, where Alibaba alone employs 128,000 people."],
            ["AI hiring is selectively reviving Chinese office markets:", "tech firms\u2019 headcount growth is generating office demand in a few cities with major AI hubs."]
          ]},
        { outlet: "SCMP", title: "\u201cChina\u2019s \u2018common prosperity\u2019 push faces reality check as inequality rises\u201d", date: "2026-05-04", url: "https://www.scmp.com/economy/china-economy/article/3352248/chinas-common-prosperity-push-faces-reality-check-inequality-rises-study",
          bullets: [
            ["Wealth Gini has nearly doubled since 1995:", "Zhejiang University economist Li Shi reports China\u2019s wealth inequality measure rose from 0.45 to above 0.7 between 1995 and 2023."],
            ["Real household income growth has halved post-2018:", "Li\u2019s data show average annual real income growth fell from around 8% to below 5%, with low- and middle-income groups most affected."]
          ]},
        { outlet: "Caixin", title: "\u201cChina\u2019s rural migrant workers age as shift to services weighs on pay\u201d", date: "2026-05-05", url: "https://www.caixinglobal.com/2026-05-05/china-rural-migrant-workforce-ages-as-shift-to-services-weighs-on-pay-102440700.html",
          bullets: [
            ["Average migrant worker hit a record 43.3 years old in 2025:", "workers over 50 reached 32% of the total, the highest share since NBS records began in 2008."],
            ["Services now absorb 54.7% of migrants as construction\u2019s share collapses to 13.8%:", "the structural shift slowed monthly income growth to 2.3%, reaching 5,075 yuan (USD 710)."]
          ]},
        { outlet: "Nikkei", title: "\u201cChina corporate earnings down for a third straight year\u201d", date: "2026-05-07", url: "https://asia.nikkei.com/economy/china-corporate-earnings-down-for-3rd-straight-year",
          bullets: [
            ["Total net profit across 5,400 non-financial listed firms fell 2% to 2.54 trillion yuan:", "the first three-year decline in data going back to 2000."],
            ["One in four listed companies booked a net loss, led by property and retail:", "1,458 firms were in the red \u2014 nearly 100 more than the prior record \u2014 with 59 of 108 real-estate firms loss-making."],
            ["Exporters carried the earnings story while domestic demand stayed flat:", "steel exports to Southeast Asia and semiconductor profits rose; youth unemployment ticked back up to 16.9% in March."]
          ]},
        { outlet: "SCMP", title: "\u201cChina\u2019s EV battery giants thrive while carmakers\u2019 profits shrink amid price wars\u201d", date: "2026-05-07", url: "https://www.scmp.com/business/china-business/article/3352561/falling-sales-widen-profit-gap-between-chinas-ev-makers-and-battery-suppliers",
          bullets: [
            ["Auto assemblers earned just 3.2% margins in Q1 versus 6% downstream:", "the gap reflects flat vehicle prices and declining new-car sales, per CPCA."],
            ["Battery and chip suppliers set to keep outpacing assemblers:", "buoyant energy-storage demand is boosting CATL while carmakers continue passing pressure down the chain."]
          ]}
      ]
    },
    {
      number: "2",
      slug: "domestic",
      short: "Domestic",
      label: "Politics and society",
      items: [
        { outlet: "Foreign Affairs", title: "\u201cXi\u2019s forever purge\u201d", date: "2026-05-04", url: "https://www.foreignaffairs.com/china/xis-forever-purge",
          bullets: [
            ["The \u201cself-revolution\u201d is being built as permanent governance design:", "the authors argue Xi is institutionalising party discipline as a succession substitute, intended to make the CCP durable beyond any individual leader."],
            ["Discipline filings hit one million in 2025, a sevenfold rise:", "three Politburo members fell in one term for the first time since the Mao era."],
            ["Overcentralised discipline now risks bureaucratic paralysis:", "tighter penalties incentivise local officials to conceal problems and comply mechanically rather than solve them."]
          ]},
        { outlet: "Foreign Policy", title: "\u201cWho is Xi\u2019s real No. 2?\u201d", date: "2026-05-07", url: "https://foreignpolicy.com/2026/05/07/china-cai-qi-li-qiang-leadership",
          bullets: [
            ["Cai Qi may not actually be Xi\u2019s true deputy:", "Li Qiang outranks Cai on key commissions and presides at the Central Economic Work Conference, reflecting greater substantive institutional authority."],
            ["By design, Xi has eliminated any genuine second-in-command:", "power is deliberately divided among trusted associates so no subordinate can form an independent centre."]
          ]},
        { outlet: "NYT", title: "\u201cChina sentences two former defense ministers on bribery charges\u201d", date: "2026-05-07", url: "https://www.nytimes.com/2026/05/07/world/asia/china-ministers-death-sentences-military-corruption.html",
          bullets: [
            ["Suspended death sentences for Generals Wei Fenghe and Li Shangfu cap the PLA purge\u2019s most senior verdicts to date:", "convicted by military courts; Xinhua announcement 7 May."],
            ["The military purge has shrunk the CMC from seven to two members:", "around 100 senior officers dismissed or under investigation since the campaign began, per a recent CSIS estimate."]
          ]},
        { outlet: "NYT", title: "\u201cHow A.I. is transforming China\u2019s entertainment industry\u201d", date: "2026-05-04", url: "https://www.nytimes.com/2026/05/03/world/asia/china-microdrama-ai-backlash.html",
          bullets: [
            ["AI micro-dramas flooded Douyin with 50,000 uploads in March alone:", "the month nearly matched Douyin\u2019s entire 2025 volume; the AI segment is projected above USD 3 billion this year."],
            ["Regulators have mandated consent before any digital likeness is used:", "rules introduced last month follow actor job losses and incidents of real people\u2019s faces appearing without permission."]
          ]},
        { outlet: "WSJ", title: "\u201cI\u2019m leaving China after 8 years. Suspicion of outsiders is rising.\u201d", date: "2026-05-06", url: "https://www.wsj.com/world/china/im-leaving-china-after-8-years-suspicion-of-outsiders-is-rising-5b70d7a2",
          bullets: [
            ["The anti-espionage campaign has produced raids on foreign firms and an executive jailed:", "American due-diligence offices searched; at least one Japanese businessman sentenced for espionage."],
            ["Chinese disapproval of the US ran at 81% in Tsinghua\u2019s 2024 poll:", "Japan scored worst and Russia highest in Chinese favourability surveys."]
          ]},
        { outlet: "Trivium", title: "\u201cCentral government introduces \u2018Beautiful China\u2019 KPI framework for local officials\u201d", date: "2026-05-08", url: "https://triviumchina.com/2026/05/08/central-government-introduces-beautiful-china-kpi-framework-for-local-officials",
          bullets: [
            ["\u201cBeautiful China\u201d provincial KPIs land via joint Central Committee\u2013State Council directive:", "establishes a framework to evaluate local officials against Xi\u2019s flagship environmental initiative."],
            ["The new system layers on top of an existing climate accountability mechanism:", "Beijing is stacking enforcement tools and tying career incentives to environmental targets at the provincial level."]
          ]}
      ]
    },
    {
      number: "3a",
      slug: "tech",
      short: "Geoecon · Tech",
      label: "Geoeconomics \u2014 tech & innovation",
      items: [
        { outlet: "Nikkei", title: "\u201cNvidia\u2019s Jensen Huang says China should not have its most advanced chips\u201d", date: "2026-05-05", url: "https://asia.nikkei.com/business/tech/semiconductors/nvidia-s-jensen-huang-says-china-should-not-have-its-most-advanced-chips",
          bullets: [
            ["Huang backs US chip leadership while opposing China access to top-tier hardware:", "China should not have the \u201clatest and greatest chips\u201d but Washington should preserve US firms\u2019 ability to sell older models there."],
            ["H200 sales to China hinge on both US approval and Beijing\u2019s own quantity rules:", "Nvidia received US export clearance for H200 earlier this year; Beijing is separately weighing limits on how much Nvidia may sell."]
          ]},
        { outlet: "FT", title: "\u201cDeepSeek nears USD 45bn valuation as China\u2019s \u2018Big Fund\u2019 leads investment talks\u201d", date: "2026-05-08", url: "https://www.ft.com/content/daaf2e0a-4a0d-4d7c-a85b-445480f6b9c7",
          bullets: [
            ["The Big Fund is in talks to lead DeepSeek\u2019s first investment round:", "China\u2019s state semiconductor vehicle \u2014 not previously invested in LLMs \u2014 is targeting a USD 45bn valuation alongside Tencent."],
            ["DeepSeek\u2019s latest model is optimised for Huawei\u2019s Ascend chips:", "Huang warned that if AI models globally \u201crun best on non-American hardware\u201d, it would be \u201ca horrible outcome\u201d for the United States."]
          ]},
        { outlet: "WSJ", title: "\u201cChina is still supplying drone factories in Iran, Russia despite US sanctions\u201d", date: "2026-05-06", url: "https://www.wsj.com/world/china-is-still-supplying-drone-factories-in-iran-russia-despite-u-s-sanctions-1e6820ca",
          bullets: [
            ["A Xiamen firm pitched Shahed drone engines directly to Iran Watch:", "Victory Technology offered Limbach L550 engines \u2014 the component powering Iran\u2019s Shahed-136 \u2014 in a wartime email blast."],
            ["US strategy is to raise costs, not halt the dual-use flows:", "forcing Iran and Russia onto lower-quality Chinese parts is the realistic goal, citing malfunctioning Russian-made Shaheds as evidence of effect."]
          ]}
      ]
    },
    {
      number: "3b",
      slug: "trade",
      short: "Geoecon · Trade",
      label: "Geoeconomics \u2014 trade, finance & industrial policy",
      items: [
        { outlet: "Wire China", title: "\u201cTrump\u2019s Board of Trade move signals the US has given up on changing China\u201d", date: "2026-05-07", url: "https://www.thewirechina.com/2026/05/07/trumps-board-of-trade-move-signals-the-u-s-has-given-up-on-changing-china",
          bullets: [
            ["The Beijing summit will debut a managed-trade framework:", "the \u201cBoard of Trade\u201d would designate products eligible for bilateral trade regardless of tensions; advanced chips remain off-limits."],
            ["Washington effectively accepts China\u2019s state model and drops liberalisation demands:", "ends Washington\u2019s decades-long effort to induce structural reform."],
            ["Talks are targeting roughly USD 30\u201340 billion of designated imports each way:", "a \u201ctariff canyon\u201d mechanism would lower duties on approved goods and raise them on blocked categories."]
          ]},
        { outlet: "Atlantic Council", title: "\u201cAs the Trump\u2013Xi summit draws closer, trade uncertainty still looms large\u201d", date: "2026-05-07", url: "https://www.atlanticcouncil.org/blogs/econographics/as-the-trump-xi-summit-draws-closer-trade-uncertainty-still-looms-large",
          bullets: [
            ["The Supreme Court IEEPA ruling forced a tariff rebuild via Sections 301 and 232:", "China\u2019s effective tariff rate fell from \u2248145% to \u224823.7% after February\u2019s ruling."],
            ["Export controls, soybean quotas and the Busan truce review top the agenda:", "the US may ease semiconductor controls for rare-earth licensing relief; China\u2019s 25 mmt soybean pledge is reportedly on track."]
          ]},
        { outlet: "WSJ", title: "\u201cChina steps up US sanctions fight, defying blacklisting over Iranian oil\u201d", date: "2026-05-05", url: "https://www.wsj.com/world/china/china-steps-up-u-s-sanctions-fight-defying-blacklisting-over-iranian-oil-e32b8427",
          bullets: [
            ["For the first time, China invoked its 2021 blocking rule:", "MOFCOM ordered Chinese companies not to comply with US sanctions on Chinese refineries buying Iranian oil."],
            ["A Hengli Petrochemical unit was sanctioned in April for Iranian crude purchases:", "Washington also warned financial institutions of secondary-sanctions exposure."],
            ["Beijing frames the move as pre-summit signalling:", "analysts read the blocking order as pressure to force a negotiation reset before the Beijing meeting."]
          ]},
        { outlet: "FT", title: "\u201cInside China\u2019s massive USD 3tn overseas acquisition spree\u201d", date: "2026-05-04", url: "https://www.ft.com/content/2b2fab66-16ea-48a7-a4cd-93022d8a13d2",
          bullets: [
            ["Chinese firms hold USD 3.3tn in offshore corporate assets, concentrated in knowledge-intensive sectors:", "an NBER paper finds nearly two-fifths of Chinese outbound investment routes through tax havens \u2014 official FDI statistics substantially undercount the footprint."],
            ["After acquisitions, target firms\u2019 patents flatline while parent filings triple:", "no equivalent effect appears for other nations\u2019 overseas M&A. The authors frame this as a state-driven strategy accepting short-run performance costs to internalise global technological capacity."]
          ]}
      ]
    },
    {
      number: "4",
      slug: "foreign",
      short: "Foreign",
      label: "Foreign policy and \u201cGlobal China\u201d",
      items: [
        { outlet: "NYT", title: "\u201cVoters exposed the limits of China\u2019s cozy ties to Orban\u201d", date: "2026-05-07", url: "https://www.nytimes.com/2026/05/07/world/europe/hungary-orban-china-fidesz-magyar.html",
          bullets: [
            ["The CATL plant helped end Fidesz dominance in Debrecen:", "local opposition to the USD 8.5 billion factory drove voters toward Tisza, flipping a Fidesz bastion."],
            ["Hungary has been Beijing\u2019s primary economic beachhead inside the EU:", "Orb\u00e1n\u2019s \u201call-weather partnership\u201d with Xi made Hungary the largest single destination for Chinese investment in Europe."],
            ["CATL rushed to engage the incoming government within days of the vote:", "it faces review of state aid estimated at USD 350\u2013900 million under a classified 2022 deal with the Orb\u00e1n government."]
          ]},
        { outlet: "WSJ", title: "\u201cTaiwan outfoxes China in a test of wills over a tiny African country\u201d", date: "2026-05-04", url: "https://www.wsj.com/world/asia/taiwan-outfoxes-china-in-test-of-wills-over-tiny-african-country-071d6fae",
          bullets: [
            ["Beijing pressured three African states to deny Taiwan\u2019s president overflight rights:", "Seychelles, Madagascar and Mauritius refused transit permits for Lai\u2019s chartered flight to Eswatini."],
            ["USD 180 billion in African loans underpins China\u2019s diplomatic leverage:", "Zambia, owing USD 6.6 billion to Chinese lenders, cancelled a scheduled human-rights conference after Beijing objected to Taiwanese participants."],
            ["Lai still reached Eswatini via an undisclosed clandestine route:", "officials declined to reveal the method until after his return to Taipei."]
          ]},
        { outlet: "Brookings", title: "\u201cForeign investment is not making friends for China \u2014 or the US\u201d", date: "2026-05-06", url: "https://www.brookings.edu/articles/foreign-investment-is-not-making-friends-for-china-or-the-us",
          bullets: [
            ["FDI erodes local goodwill for both China and the US:", "a 750-project study across 23 African countries finds proximity to investment decreases community affinity for the investing power, despite raising perceived influence."],
            ["Unmet jobs and corruption perceptions drive the backlash equally:", "overpromised employment and heightened perceptions of corruption near foreign projects erode affinity for both."],
            ["China\u2019s BRI investment in Africa nearly tripled in 2025:", "USD 61 billion in flows \u2014 nearly triple the prior year \u2014 deployed across 53 African BRI states."]
          ]},
        { outlet: "Brookings", title: "\u201cHow dangerous is the current China\u2013Japan rift?\u201d", date: "2026-05-05", url: "https://www.brookings.edu/articles/how-dangerous-is-the-current-china-japan-rift",
          bullets: [
            ["Takaichi\u2019s Taiwan remarks have triggered China\u2019s broadest exchange freeze since 1972:", "Beijing cancelled academic, business and cultural exchanges and placed 20 Japanese firms and universities on its export-control entity list."],
            ["Takahara puts the severity down to Xi\u2019s structural authority:", "the party-state machinery amplifies Xi\u2019s cues rather than moderating them \u2014 a pattern he compares to zero-COVID overreach."],
            ["APEC Shenzhen in November is the earliest rapprochement indicator:", "Ren Xiao points to a potential Xi\u2013Takaichi sideline meeting as the first signal."]
          ]},
        { outlet: "New Yorker", title: "\u201cHow the Iran war is shifting power toward China\u201d", date: "2026-05-06", url: "https://www.newyorker.com/news/the-lede/how-the-iran-war-is-shifting-power-toward-china",
          bullets: [
            ["The Iran war breaks China out of Russia-alignment isolation:", "Yuen Yuen Ang argues the conflict creates diplomatic space for Beijing to reposition itself globally, not just in the Middle East."],
            ["Oil-shock urgency is translating into record Chinese clean-energy exports:", "solar systems, batteries and EVs posted record March sales as Asian economies seek to insulate themselves from future Hormuz disruptions."],
            ["Gallium and Iran mediation give Xi structural leverage at the summit:", "ICG\u2019s Ali Wyne notes the US cannot replenish Middle East missile interceptors without Chinese gallium, nor bring Iran back to negotiations without Beijing."]
          ]},
        { outlet: "Foreign Affairs", title: "\u201cWhy China waits\u201d", date: "2026-05-08", url: "https://www.foreignaffairs.com/taiwan/why-china-waits",
          bullets: [
            ["Beijing is betting patience reduces the cost of unification with Taiwan:", "the authors argue near-term force is prohibitively costly and China expects its growing capabilities to compel Taiwan without a full-scale invasion."],
            ["Taiwan youth support for independence has fallen sharply since 2023:", "those aged 20\u201329 favouring independence dropped from 26.7% to 17.9%; the share rejecting \u201cone China\u201d fell from 82.1% to 65.8%, per My Formosa."],
            ["2028 elections are the key test for Beijing\u2019s patient strategy:", "Lai\u2019s re-election could push China toward quarantine or closer military operations if read as momentum toward formal independence."]
          ]},
        { outlet: "Lowy Institute", title: "\u201cAfter annexation: How China plans to run Taiwan\u201d", date: "2026-05-10", url: "https://www.lowyinstitute.org/publications/after-annexation-how-china-plans-run-taiwan",
          bullets: [
            ["Xi\u2019s unification terms have shifted from autonomy to absorptive control:", "Beijing now demands Taiwan\u2019s full political integration into the CCP system, abandoning earlier offers of genuine self-governance."],
            ["PRC scholars foresee mass exclusion and imprisonment of political opponents:", "phased post-takeover governance envisions immediate security crackdowns, restructuring beyond Hong Kong\u2019s model, and decades of identity re-engineering."],
            ["PRC post-unification thinking is riddled with unresolved contradictions:", "autonomy is deemed necessary but withheld; coercion can deliver stability but not legitimacy; scholars offer no synthesis."]
          ]}
      ]
    },
    {
      number: "5",
      slug: "responses",
      short: "Responses",
      label: "Strategic implications and responses",
      items: [
        { outlet: "Noah Barkin", title: "\u201cWatching China in Europe \u2014 May 2026\u201d", date: "2026-05-04", url: "https://nbarkin.substack.com/p/watching-china-in-europe-may-2026?triedRedirect=true",
          bullets: [
            ["The Commission will seek a European Council mandate on China in June:", "officials plan to deploy safeguards across chemicals, machinery and PHEVs as an interim measure while developing a Section 301-style broad instrument."],
            ["Q1 EU\u2013China deficit surged amid Beijing retaliation threats:", "the Commission signalled a shift from technocratic restraint \u2014 \u201cpreparedness to sustain pain from Chinese countermeasures\u201d."]
          ]},
        { outlet: "SCMP", title: "\u201cEU sounds out industry over new trade weapon against China\u2019s overcapacity\u201d", date: "2026-05-05", url: "https://www.scmp.com/news/china/diplomacy/article/3352443/eu-sounds-out-industry-over-new-trade-weapon-against-chinas-overcapacity",
          bullets: [
            ["Brussels is polling EU industry on a new anti-overcapacity instrument:", "the Commission is sounding out business groups ahead of a 29 May all-commissioners China debate."],
            ["April\u2019s commissioners\u2019 China debate was delayed by Iran energy concerns:", "the full session was postponed while EU officials focused on the energy price impact of the US\u2013Israel war on Iran."]
          ]},
        { outlet: "FT", title: "\u201cEU anti-dumping complaints against Chinese chemicals at record high\u201d", date: "2026-05-06", url: "https://www.ft.com/content/6822f01a-147a-4b04-a9d6-edeefc25d0d8",
          bullets: [
            ["Chemical anti-dumping filings now make up nearly half of EU cases:", "Brussels opened 24 cases in two years, up from one per year in 2018\u201320."],
            ["China\u2019s property bust is redirecting chemical overcapacity to Europe:", "a senior EU official attributes the surge to collapsed domestic demand, with zombie suppliers exporting excess construction-sector output abroad."],
            ["EU chemical capacity has fallen 7% as the closure rate doubles:", "Cefic reports some products \u2014 including paracetamol \u2014 are now made by just one remaining EU manufacturer."]
          ]},
        { outlet: "FT", title: "\u201cEU blocks funds for key Chinese solar energy parts\u201d", date: "2026-05-05", url: "https://www.ft.com/content/341d3ee4-bae1-4819-8db2-b91767a2752d",
          bullets: [
            ["From 1 November, the EU bans public funds for Chinese solar inverters:", "the Commission cited risks of remote network manipulation enabling \u201ccountrywide blackouts\u201d."],
            ["China holds over half the global inverter market, with comparable EU exposure:", "non-Chinese alternatives from Japan and South Korea would add less than 2% to solar installation costs."],
            ["The ban extends an emerging EU framework excluding Chinese tech from clean-energy public funding:", "follows the Industrial Accelerator Act for EVs and the Cybersecurity Act targeting Huawei in telecom and solar."]
          ]},
        { outlet: "ChinaTalk", title: "\u201cHow to score economic security\u201d", date: "2026-05-04", url: "https://www.chinatalk.media/p/measuring-americas-chokepoints",
          bullets: [
            ["The author proposes two economic-security benchmarks:", "a Chokepoint Exposure Index (GDP share at adversary-controlled supply risk, target below 2%) and Mobilization Elasticity (surge output in 180 days, target 50%)."],
            ["US aggregate mobilization elasticity comes in below 5%:", "assessed across nine critical sectors, Stingers, gallium and advanced chips are at near zero."],
            ["China\u2019s mineral export controls illustrate adversary chokepoint leverage:", "gallium exports neared zero throughout 2025 with prices up 365%, while US primary gallium production remained at zero throughout the shock."]
          ]},
        { outlet: "Nikkei", title: "\u201cTrump administration looks to ease memory chip crunch with supply-chain bloc\u201d", date: "2026-05-06", url: "https://asia.nikkei.com/spotlight/supply-chain/trump-administration-looks-to-ease-memory-chip-crunch-with-supply-chain-bloc",
          bullets: [
            ["State Department frames Pax Silica as leverage for Trump\u2019s Beijing visit:", "Undersecretary Helberg told Nikkei the 14-country semiconductor coalition gives Washington \u201cmaximum optionality\u201d ahead of the 14\u201315 May summit."],
            ["A 4,000-acre Luzon industrial hub is targeted for memory and packaging:", "part of a broader effort to relocate non-leading-edge capacity outside China and Taiwan."]
          ]}
      ]
    }
  ],
  topCharts: [
    { src: "assets/charts/W19-chart-1.jpg", alt: "Top chart 1 — Soapbox / MERICS" },
    { src: "assets/charts/W19-chart-2.jpg", alt: "Top chart 2 — Soapbox / MERICS" },
    { src: "assets/charts/W19-chart-3.jpg", alt: "Top chart 3 — Soapbox / MERICS" },
    { src: "assets/charts/W19-chart-4.jpg", alt: "Top chart 4 — Soapbox / MERICS" },
    { src: "assets/charts/W19-chart-5.jpg", alt: "Top chart 5 — Soapbox / MERICS" }
  ],
  // wochenbericht is attached just below — tolerant of script load order.
};
// The Wochenbericht ships in a separate file (data/W19-2026-wochenbericht.js)
// because of its size. Either load order works: this file sets the field if
// the companion has already run; otherwise the companion sets it on us.
if (window.W19_WOCHENBERICHT) window.W19_2026.wochenbericht = window.W19_WOCHENBERICHT;
