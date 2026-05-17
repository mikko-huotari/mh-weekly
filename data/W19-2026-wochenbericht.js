// W19-2026 — Wochenbericht (German media review).
// Separate file to keep the main weekly data manageable.
// Script-load order is irrelevant: whichever file loads second attaches.

window.W19_WOCHENBERICHT = {
  label: "Wochenbericht: CN-Beziehungen durch die DE-Medien-Brille",
  caveat: "Caveat: nur stichprobenartig auf Qualit\u00e4t / Richtigkeit \u00fcberpr\u00fcft \u2014 Coverage nur bis 10. Mai 2026.",
  sections: [
    // ----- 1. Prominente Zitate ----------------------------------------
    {
      number: "1",
      slug: "quotes",
      short: "Zitate",
      label: "Prominente Zitate und Positionen zu China-bezogenen Angelegenheiten",
      items: [
        { kind: "quote", lead: "Donald Trump",
          text: "bekr\u00e4ftigte am Donnerstag seine Absicht, bei seinem anstehenden Peking-Besuch den Handel neu zu ordnen und Amerikas Technologievorsprung zu sichern, wobei er laut Bericht eine \u201cSehnsucht nach dem Deal\u201d zeige.",
          source: { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-07", title: "TRUMP VOR DER CHINA-REISE; Sehnsucht nach dem Deal" } },
        { kind: "quote", lead: "Friedrich Merz",
          text: "betonte am Mittwoch bei einem Treffen mit Unternehmern die Notwendigkeit eines gesellschaftlichen Zusammenhalts in Krisenzeiten, wobei er mit Kritikern konfrontiert wurde, die angesichts seiner Politik \u201cfassungslose\u201d Sorgen um den Standort Deutschland \u00e4u\u00dferten.",
          source: { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-06", title: "Einsparungen; Warum der Kanzler kurz wie ein Sozialdemokrat klingt" } },
        { kind: "quote", lead: "Li Qiang (Chinesischer Ministerpr\u00e4sident)",
          text: "signalisierte am Donnerstag in Peking vor dem Trump-Besuch Gespr\u00e4chsbereitschaft in Handelsfragen, wobei Beobachter davon ausgehen, dass er versuchen wird, Pekings Machtposition \u201cdiskret aber bestimmt\u201d zu wahren.",
          source: { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-07", title: "CHINA-US-GIPFEL; Kalk\u00fcl, kein Kurswechsel" } },
        { kind: "quote", lead: "Johann Wadephul",
          text: "forderte am Mittwoch bei der Adenauer-Konferenz in Berlin ein geschlossenes europ\u00e4isches Auftreten gegen\u00fcber den USA und China sowie eine EU der unterschiedlichen Geschwindigkeiten: \u201cFortschritt wird sich vermutlich nicht immer mit allen 27 Mitgliedern erzielen lassen.\u201d",
          source: { outlet: "Der Tagesspiegel", outletDisplay: "Der Tagesspiegel", date: "2026-05-07", title: "Wadephul will schnellere und schlankere EU" } },
        { kind: "quote", lead: "Wang Yi (Chinesischer Au\u00dfenminister)",
          text: "forderte am Mittwoch beim Empfang seines iranischen Amtskollegen in Peking eine Fortsetzung der Friedensverhandlungen und erkl\u00e4rte: \u201cEin umfassender Waffenstillstand duldet keinen Aufschub.\u201d",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-07", title: "China und Iran stimmen sich vor Trump-Besuch ab" } },
        { kind: "quote", lead: "Katherina Reiche (Bundeswirtschaftsministerin, CDU)",
          text: "prangerte am Donnerstag in Paris im Vorfeld des G7-Treffens \u201cunfaire Wettbewerbspraktiken\u201d Chinas an und setzte damit ein deutliches Signal f\u00fcr ihren Antrittsbesuch in der Volksrepublik Ende Mai.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-07", title: "Reiche: \u201cEs gibt Staaten, die sich nicht an Regeln halten\u201d; Wirtschaftsministerin \u00e4u\u00dfert sich chinakritisch" } },
        { kind: "quote", lead: "Jens Spahn (Unionsfraktionsvorsitzender)",
          text: "hob am Donnerstag in Berlin hervor, dass Deutschland unter Kanzler Merz die Zeitenwende umsetze: \u201cWir haben heute den viertgr\u00f6\u00dften Verteidigungsetat der Welt nach den USA, China und Russland.\u201d",
          source: { outlet: "Der Tagesspiegel", outletDisplay: "Der Tagesspiegel", date: "2026-05-07", title: "Koalition ist nicht v\u00f6llig erfolglos" } },
        { kind: "quote", lead: "Arno Antlitz (Finanzvorstand, Volkswagen AG)",
          text: "warnte laut Bericht vom 2. Mai vor dem drastischen Marktwandel und betonte, dass VW die Kapazit\u00e4ten reduzieren m\u00fcsse, da chinesische Hersteller \u201cin Ost- und S\u00fcdeuropa effiziente Werke\u201d bauten und Wettbewerbsdruck nach Europa exportierten.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-02", title: "\u201cEs geht um die Zukunft von Volkswagen\u201d" } },
        { kind: "quote", lead: "Mathias Zachert (Lanxess-Vorstandschef)",
          text: "konstatierte am Donnerstag eine Verschiebung des globalen Bildes in der Chemie und sah die europ\u00e4ische Industrie gegen\u00fcber der asiatischen im Vorteil: \u201cBei den Kunden stehe jetzt Lieferzuverl\u00e4ssigkeit an erster Stelle.\u201d",
          source: { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-07", title: "Lanxess-Chef rechnet mit \u201eschweren Verwerfungen\u201c vor allem in Asien" } },
        { kind: "quote", lead: "Henrik Andersen (Vorstandschef, Vestas)",
          text: "\u00e4u\u00dferte sich am Freitag besorgt \u00fcber die Auswirkungen der europ\u00e4ischen Energiepolitik und betonte, dass China aus der Krise 2022 gelernt habe, die eigene \u201cEnergieversorgung in allen Bereichen\u201d zu vervielfachen.",
          source: { outlet: "Die Welt", outletDisplay: "Die Welt", date: "2026-05-08", title: "Dass die Lufthansa zuletzt 20.000 Fl\u00fcge gestrichen hat, ist kein Zufall" } },
        { kind: "quote", lead: "Sinan Selen (Vizepr\u00e4sident, Bundesamt f\u00fcr Verfassungsschutz)",
          text: "bekr\u00e4ftigte laut Bericht vom Mittwoch seine Warnungen vor dem strategischen Abfluss von Know-how durch Personalwechsel zu chinesischen Staatskonzernen wie Huawei.",
          source: { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-06", title: "Diplomatie; F\u00fcnf Weltkrisen, die Deutschlands Au\u00dfenpolitik \u00fcberfordern" } },
        { kind: "quote", lead: "Sanae Takaichi (Japanische Ministerpr\u00e4sidentin)",
          text: "erkl\u00e4rte laut Bericht vom Montag, sie wolle Japan \u201cwieder zur\u00fcck auf die Weltb\u00fchne\u201d bringen und suchte daf\u00fcr demonstrativ die N\u00e4he zu europ\u00e4ischen Partnern gegen regionale Risiken.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-04", title: "Japans neues Auftreten" } },
        { kind: "quote", lead: "Abbas Araghchi (Iranischer Au\u00dfenminister)",
          text: "betonte am Mittwoch in Peking die strategische Partnerschaft mit der Volksrepublik und wollte damit \u201cHandlungsf\u00e4higkeit demonstrieren\u201d.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-07", title: "China und Iran stimmen sich vor Trump-Besuch ab" } },
        { kind: "quote", lead: "Mikko Huotari (Direktor MERICS)",
          text: "analysierte am Donnerstag, dass f\u00fcr Europa der Korridor f\u00fcr eine eigene Strategie schrumpfe, w\u00e4hrend die Gro\u00dfm\u00e4chte einen \u201cWaffenstillstand\u201d bei Exportkontrollen aushandelten.",
          source: { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-07", title: "CHINA-US-GIPFEL; Kalk\u00fcl, kein Kurswechsel" } },
        { kind: "quote", lead: "Huang Ping (Pr\u00e4sident des Chinesischen Instituts in Hongkong)",
          text: "betonte am Mittwoch, dass ein wissenschaftlicher Austausch zwischen China, Afrika und Europa angesichts einer sich \u201cdramatisch neu konfigurierenden multipolaren Welt\u201d wichtiger denn je sei.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-06", title: "Pandab\u00e4ren reizt man nicht" } },
        { kind: "quote", lead: "Michael Kotzbauer (Stellv. Vorstandsvorsitzender, Commerzbank)",
          text: "berichtete am Dienstag von seinen Erfahrungen in Shanghai und betonte, man m\u00fcsse verstehen, \u201cwelche Bed\u00fcrfnisse an eine Bank der deutsche Mittelstand in China hat\u201d.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-05", title: "Unicredits Plan zerlegt die Commerzbank" } },
        { kind: "quote", lead: "Jozef Kaban (Designchef, MG/SAIC)",
          text: "erkl\u00e4rte am Dienstag den Erfolg seines neuen chinesischen Arbeitgebers mit dem enormen Tempo: \u201cEs geht alles wahnsinnig schnell hier.\u201d",
          source: { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-05", title: "Autobauer; MG greift VW in Europa st\u00e4rker an" } },
        { kind: "quote", lead: "Frank Stocker (Finanzredakteur)",
          text: "stellte am Donnerstag fest, dass das Finanzsystem vor einer Z\u00e4sur stehe, da aufstrebende Schwellenl\u00e4nder ihre Goldreserven massiv ausgebaut haben.",
          source: { outlet: "Die Welt", outletDisplay: "Die Welt", date: "2026-05-07", title: "Die Folgen der Dollar-D\u00e4mmerung" } },
        { kind: "quote", lead: "Sarah Speicher-Utsch (Finanzexpertin)",
          text: "analysierte am Montag den Erfolg asiatischer Aktienm\u00e4rkte: \u201cDer chinesische Aktienmarkt hat im Jahr 2025 um fast ein Drittel zugelegt.\u201d",
          source: { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-04", title: "TRIP.COM STATT TENCENT; Diese Chancen in China \u00fcbersehen gerade viele Anleger" } }
      ]
    },

    // ----- 2. Wichtige Entwicklungen in Fakten und Zahlen --------------
    {
      number: "2",
      slug: "facts",
      short: "Fakten",
      label: "Wichtige China-bezogene Entwicklungen in Fakten und Zahlen",
      items: [
        { kind: "fact", lead: "Massive Investition von VW in Rivian",
          text: "Um Softwareprobleme zu l\u00f6sen, wurde Volkswagen zum gr\u00f6\u00dften Aktion\u00e4r beim US-Elektroautohersteller Rivian \u2014 als strategische Antwort auf die technologische \u00dcberlegenheit chinesischer E-Autos.",
          source: { outlet: "DIE ZEIT", outletDisplay: "zeit.de", date: "2026-05-06", title: "Volkswagen; VW wird gr\u00f6\u00dfter Aktion\u00e4r bei Tesla-Konkurrent Rivian" } },
        { kind: "fact", lead: "Explosion der globalen Halbleiterums\u00e4tze",
          text: "In den ersten drei Monaten 2026 stiegen die weltweiten Verk\u00e4ufe von Chips um knapp 80% auf rund 300 Milliarden Dollar \u2014 einer der steilsten Anstiege der Branchengeschichte.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-07", title: "Historische Hausse der Chipbranche; Die Nachfrage ist riesig / Aktienkurse mit Rekorden" } },
        { kind: "fact", lead: "Milliarden-Finanzierung f\u00fcr chinesischen KI-Entwickler",
          text: "Das KI-Start-up Moonshot sammelte in einer neuen Kapitalerh\u00f6hung zwei Milliarden Dollar ein und wird nun mit insgesamt 20 Milliarden Dollar bewertet.",
          source: { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-07", title: "Moonshot; Chinesischer KI-Entwickler sammelt zwei Milliarden Dollar ein" } },
        { kind: "fact", lead: "Gewinnr\u00fcckgang bei BMW durch Z\u00f6lle und China-Schw\u00e4che",
          text: "BMW verzeichnete im ersten Quartal 2026 ein Umsatzminus von 8,1% auf rund 31 Mrd. Euro; der Gewinn brach um 23,1% auf 1,67 Mrd. Euro ein \u2014 belastet durch US-Z\u00f6lle und harten Wettbewerb in China.",
          source: { outlet: "BILD", outletDisplay: "BILD", date: "2026-05-07", title: "VERLIERER" } },
        { kind: "fact", lead: "Siemens Healthineers d\u00e4mpft China-Erwartungen",
          text: "Wegen struktureller Ver\u00e4nderungen im chinesischen Diagnostikmarkt senkte das Unternehmen seine Umsatzwachstumsprognose von 5,0\u20136,0% auf nunmehr 4,5\u20135,0%.",
          source: { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-08", title: "Healthineers d\u00e4mpft die Erwartungen" } },
        { kind: "fact", lead: "Machtverschiebung bei Goldreserven",
          text: "Der Anteil der Schwellenl\u00e4nder (BRICS etc.) an den weltweiten Goldreserven der Notenbanken ist auf 52% gestiegen \u2014 die Bedeutung des Dollars als Reservew\u00e4hrung schwindet.",
          source: { outlet: "Die Welt", outletDisplay: "Die Welt", date: "2026-05-07", title: "Die Folgen der Dollar-D\u00e4mmerung" } },
        { kind: "fact", lead: "Rekord-Gewinnprognose f\u00fcr Samsung",
          text: "Getrieben durch den KI-Speicherboom erwartet Samsung einen historischen Gewinn; der B\u00f6rsenwert des Konzerns hat erstmals die Billionen-Dollar-Marke \u00fcberschritten.",
          source: { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-06", title: "CSI 300; Asiens B\u00f6rsen auf Rekordhoch" } },
        { kind: "fact", lead: "Insolvenzwelle in Westeuropa",
          text: "Im Jahr 2025 wurden fast 200.000 Unternehmensinsolvenzen gez\u00e4hlt \u2014 ein Achtel davon in Deutschland; Experten erwarten f\u00fcr 2026 einen weiteren Anstieg durch den Wettbewerbsdruck aus Fernost.",
          source: { outlet: "WirtschaftsWoche", outletDisplay: "wiwo.de", date: "2026-05-05", title: "Insolvenzen; Firmenpleiten in Westeuropa auf h\u00f6chstem Stand" } },
        { kind: "fact", lead: "MG \u00fcberholt Konkurrenz in Europa",
          text: "Die SAIC-Marke MG ist inzwischen der erfolgreichste chinesische Hersteller in Europa; im Q1 2026 kamen die 21 gr\u00f6\u00dften China-Marken bereits auf \u00fcber 8% Marktanteil (vor drei Jahren: 2,1%).",
          source: { outlet: "Handelsblatt", outletDisplay: "Handelsblatt", date: "2026-05-06", title: "AUTOINDUSTRIE; Chinas Hersteller wachsen in Europa" } },
        { kind: "fact", lead: "Sanierungsbedarf bei Nio Deutschland",
          text: "Die Europazentrale des chinesischen Herstellers Nio musste die deutsche Tochter bereits mit 160 Millionen Euro sanieren; das exklusive Vertriebskonzept findet hierzulande bisher kaum K\u00e4ufer.",
          source: { outlet: "S\u00fcddeutsche Zeitung", outletDisplay: "S\u00fcddeutsche Zeitung", date: "2026-05-05", title: "Acht Autos und ein gro\u00dfes Missverst\u00e4ndnis" } },
        { kind: "fact", lead: "SpaceX plant massive Chip-Investition",
          text: "Das Weltraumunternehmen von Elon Musk plant Investitionen von mindestens 55 Milliarden Dollar in eine eigene Chipproduktion, um unabh\u00e4ngiger von asiatischen Lieferketten zu werden.",
          source: { outlet: "Spiegel", outletDisplay: "spiegel.de", date: "2026-05-08", title: "SpaceX will mindestens 55 Milliarden in Chipfabrik investieren" } },
        { kind: "fact", lead: "Biontech-Stellenabbau in Deutschland",
          text: "Der Impfstoffpionier schlie\u00dft fast alle deutschen Produktionsstandorte und baut rund 1.860 Stellen (etwa 22% der Belegschaft) ab.",
          source: { outlet: "Handelsblatt", outletDisplay: "Handelsblatt", date: "2026-05-06", title: "PHARMA; Biontech baut rund 1800 Arbeitspl\u00e4tze ab" } },
        { kind: "fact", lead: "Preisschock bei strategischen Rohstoffen",
          text: "Infolge des Iran-Kriegs verteuerte sich Lithium um \u00fcber 80% und Wolfram (wichtig f\u00fcr KI-Chips und Waffen) um mehr als 130%.",
          source: { outlet: "WirtschaftsWoche", outletDisplay: "wiwo.de", date: "2026-05-06", title: "Preise; Fast alle Rohstoffe verteuern sich erheblich" } }
      ]
    },

    // ----- 3. Fünf zentrale Themen -------------------------------------
    {
      number: "3",
      slug: "themes",
      short: "Themen",
      label: "F\u00fcnf zentrale Themen in der deutschen China-Politik Diskussion",
      items: [
        { kind: "theme",
          title: "Die strategische Z\u00e4sur des Trump\u2013Xi-Gipfels und das Ende der NATO-Gewissheit",
          text: "Die Medien analysieren intensiv den anstehenden Peking-Besuch von Donald Trump. Es herrscht die Bef\u00fcrchtung vor, dass die USA einen \u201cGeheimdeal\u201d mit China zu Lasten europ\u00e4ischer Interessen schlie\u00dfen k\u00f6nnten. Die Diskussion dreht sich um die schrumpfenden Handlungsspielr\u00e4ume f\u00fcr Europa und die Erkenntnis, dass die USA unter Trump nicht l\u00e4nger als Garant der Sicherheit wahrgenommen werden \u2014 was Deutschland zu einer eigenst\u00e4ndigen milit\u00e4rischen und wirtschaftlichen Positionierung zwingt.",
          sources: [
            { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-07", title: "CHINA-US-GIPFEL; Kalk\u00fcl, kein Kurswechsel" },
            { outlet: "FAZ", outletDisplay: "FAZ", date: "2026-05-07", title: "Peking wird genau \u00fcberlegen" },
            { outlet: "Der Tagesspiegel", outletDisplay: "Der Tagesspiegel", date: "2026-05-06", title: "Eine Supermacht zieht sich zur\u00fcck" }
          ]
        },
        { kind: "theme",
          title: "Die \u201eResilienz-Gegenbewegung\u201c \u2014 Debatte gegen die Standort-Jammerei",
          text: "W\u00e4hrend die Industrie \u00fcber wegbrechende China-Gewinne klagt, formiert sich in den Leitmedien eine Diskussion \u00fcber die untersch\u00e4tzten St\u00e4rken des Standorts Deutschland. Es wird debattiert, ob die st\u00e4ndige Fokussierung auf den \u201eChina-Speed\u201c und den eigenen Abstieg eine \u201eselbsterf\u00fcllende Prophezeiung\u201c sei. Die Berichterstattung hebt hervor, dass Deutschland in Bereichen wie Ehrenamt, Gleichberechtigung und spezifischen Nischenm\u00e4rkten weiterhin weltweit f\u00fchrend ist und die Krise als Chance zur R\u00fcckbesinnung auf \u201eMade in Germany\u201c nutzen sollte.",
          sources: [
            { outlet: "DIE ZEIT", outletDisplay: "DIE ZEIT", date: "2026-05-07", title: "Titelthema: Wo Deutschland noch funktioniert; Nicht schlecht" },
            { outlet: "DIE ZEIT", outletDisplay: "DIE ZEIT", date: "2026-05-07", title: "Titelthema: Wo Deutschland noch funktioniert; Heul doch!" },
            { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-03", title: "\u00d6konom Achim Wambach; \u2018So schlecht geht es uns gar nicht\u2019" }
          ]
        },
        { kind: "theme",
          title: "Indien als strategische Bildungs- und Fachkr\u00e4fte-Alternative zu China",
          text: "In der deutschen China-Politik wird Indien zunehmend nicht mehr nur als Absatzmarkt, sondern als personelle und akademische Alternative zur Volksrepublik diskutiert. Mit einer Rekordzahl von fast 60.000 indischen Studierenden in Deutschland wird debattiert, ob dies der Weg ist, um die Abh\u00e4ngigkeit von chinesischen Forschungskooperationen und Fachkr\u00e4ften zu brechen. Die Diskussion befasst sich kritisch damit, ob Deutschland Indien lediglich als \u201eGesch\u00e4ftsmodell\u201c nutzt oder ob hier eine echte strategische Partnerschaft entsteht.",
          sources: [
            { outlet: "DIE ZEIT", outletDisplay: "DIE ZEIT", date: "2026-05-07", title: "Studierenden-Spezial; \u00bbWir beobachten Trittbrettfahrer\u00ab" },
            { outlet: "DIE ZEIT", outletDisplay: "DIE ZEIT", date: "2026-05-07", title: "Warum in \u00d6sterreich so viele Organe gespendet werden \u2014 und was kann Deutschland davon lernen? [Kontext Fachkr\u00e4fte]" },
            { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-07", title: "Morning Briefing; Wie Deutschland durch die globalen Krisen taumelt" }
          ]
        },
        { kind: "theme",
          title: "Die Politisierung des Goldes und der langsame Abschied vom Dollar",
          text: "Ein neues Thema in der deutschen Fachpresse ist der rasant steigende Goldpreis als Symptom f\u00fcr die \u201eDollar-D\u00e4mmerung\u201c. Es wird analysiert, wie China und andere Schwellenl\u00e4nder ihre Reserven systematisch umschichten, um sich gegen westliche Sanktionen (wie im Iran-Krieg) zu wappnen. Die Diskussion warnt vor einer fundamentalen Verschiebung des globalen Finanzsystems, die Europas Exportabh\u00e4ngigkeit vom Dollar zum Risiko macht.",
          sources: [
            { outlet: "Die Welt", outletDisplay: "Die Welt", date: "2026-05-07", title: "Die Folgen der Dollar-D\u00e4mmerung" },
            { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-07", title: "Trumps tollk\u00fchne Dollar-Wette" },
            { outlet: "Handelsblatt", outletDisplay: "handelsblatt.com", date: "2026-05-06", title: "CSI 300; Asiens B\u00f6rsen auf Rekordhoch" }
          ]
        },
        { kind: "theme",
          title: "Die maritime Achillesferse und die \u201eHormus\u2013Malakka-Zange\u201c",
          text: "Nach der Hormus-Blockade r\u00fcckt nun die Stra\u00dfe von Malakka als n\u00e4chster potenzieller geopolitischer Erpressungspunkt in den Fokus. Die Berichterstattung warnt, dass China seine \u201cmaritimen Kronjuwelen\u201d (Kontrolle \u00fcber H\u00e4fen und Seewege) gezielt einsetzt, um die Rohstoffversorgung Europas zu gef\u00e4hrden. Die Diskussion fordert eine offensive maritime Sicherheitsstrategie und einen Schutz kritischer Infrastruktur auf See vor hybriden Angriffen.",
          sources: [
            { outlet: "FAZ", outletDisplay: "faz.net", date: "2026-05-07", title: "STRASSE VON MALAKKA; Hormus 2.0" },
            { outlet: "Welt am Sonntag", outletDisplay: "Welt am Sonntag", date: "2026-05-03", title: "Maritime Achillesferse" }
          ]
        }
      ]
    }
  ]
};
// Companion to data/W19-2026.js — see comment there. Late-attach if the main
// week file has already executed.
if (window.W19_2026) window.W19_2026.wochenbericht = window.W19_WOCHENBERICHT;
