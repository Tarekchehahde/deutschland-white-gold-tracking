# Quellen-Whitelist (RSS & offene XML-Feeds)

Diese Liste ist **groß by design**: hohe Abdeckung für Metriken, aber **stark überlappend** (ARD/NDR/Tagesschau regional decken sich thematisch). Der Pipeline soll **URL-Deduplizierung** obligatorisch sein.

**Pflicht vor Produktivbetrieb:** Jede URL einmal im Browser oder Feedreader öffnen; Nutzungsbedingungen des Anbieters prüfen (oft „nicht-kommerziell“, Attribution). Keine Paywalls knacken.

## Legende „HTTP“

| Code | Bedeutung |
|------|-----------|
| ✓ 200 | Per HEAD/GET am **2026-05-14** erfolgreich (kurzer Agenten-Check). |
| ⚠ | Beim Check Zeitüberschreitung, 5xx oder DNS-Fehler — **manuell prüfen**. |
| (–) | Noch nicht automatisch geprüft — nur aus Publisher-Doku / Literatur. |

---

## Deutschland — überregional (Nachrichten & Politik)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| tagesschau — alle Meldungen | https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml | ✓ | Breiter Kopf-Feed |
| tagesschau — Startseite | https://www.tagesschau.de/index~rss2.xml | (–) | ARD-Doku |
| tagesschau — Inland | https://www.tagesschau.de/inland/index~rss2.xml | (–) | |
| tagesschau — Regional gesamt | https://www.tagesschau.de/inland/regional/index~rss2.xml | (–) | |
| tagesschau — Ausland | https://www.tagesschau.de/ausland/index~rss2.xml | (–) | |
| tagesschau — Europa | https://www.tagesschau.de/ausland/europa/index~rss2.xml | ✓ | EU-Kontext |
| tagesschau — Innenpolitik | https://www.tagesschau.de/inland/innenpolitik/index~rss2.xml | (–) | |
| tagesschau — Gesellschaft | https://www.tagesschau.de/inland/gesellschaft/index~rss2.xml | (–) | |
| ZDF Nachrichten | https://www.zdf.de/rss/zdf/nachrichten | ✓ | |
| Deutsche Welle — alle DE | https://rss.dw.com/xml/rss-de-all | ✓ | |
| Deutsche Welle — Nachrichten | https://rss.dw.com/xml/rss-de-news | (–) | DW-Doku |
| Deutsche Welle — Top-Themen | https://rss.dw.com/xml/rss-de-top | (–) | DW-Doku |
| Deutsche Welle — Wirtschaft | https://rss.dw.com/xml/rss-de-eco | ✓ | |
| Deutsche Welle — Wissenschaft | https://rss.dw.com/xml/rss-de-sci | (–) | DW-Doku |
| Deutsche Welle — Technologie | https://rss.dw.com/xml/rss-de-tech | (–) | DW-Doku |
| Deutsche Welle — Politik | https://rss.dw.com/xml/rss-de-pol | (–) | DW-Doku |
| Deutschlandfunk — Nachrichten | https://www.deutschlandfunk.de/nachrichten-100.rss | ✓ | |
| Deutschlandfunk — Politikportal | https://www.deutschlandfunk.de/politikportal-100.rss | ✓ | |
| Deutschlandfunk — Europa | https://www.deutschlandfunk.de/europa-112.rss | ✓ | EU-Stoff |
| Deutschlandfunk — Wirtschaft | https://www.deutschlandfunk.de/wirtschaft-106.rss | ✓ | |
| Deutschlandfunk — Wissen | https://www.deutschlandfunk.de/wissen-106.rss | ✓ | Forschung/Umwelt |
| DER SPIEGEL — Schlagzeilen | https://www.spiegel.de/schlagzeilen/index.rss | ✓ | Schwerpunkte gemischt |
| Süddeutsche — Wirtschaft | https://rss.sueddeutsche.de/rss/Wirtschaft | ✓ | |
| Süddeutsche — Eilmeldungen | https://rss.sueddeutsche.de/rss/Eilmeldungen | (–) | SZ-Pfad üblich |
| Süddeutsche — Alle Nachrichten | https://rss.sueddeutsche.de/rss/Alle%20Nachrichten | (–) | Encoding beachten |
| DIE ZEIT — Hauptfeed | https://newsfeed.zeit.de/index | ✓ | |
| DIE ZEIT — Wirtschaft | https://newsfeed.zeit.de/wirtschaft/index | (–) | Typisches URL-Muster |
| DIE ZEIT — Wissen | https://newsfeed.zeit.de/wissen/index | (–) | |
| FAZ — aktuell | https://www.faz.net/rss/aktuell/ | ✓ | Gesamt-Ressort |
| FAZ — Wirtschaft | https://www.faz.net/aktuell/wirtschaft/rss-feed | (–) | Auf faz.net „RSS“ suchen falls geändert |
| Frankfurter Rundschau — Start | https://www.fr.de/rss | (–) | fr.de nutzt mitunter neue Pfade — prüfen |
| taz — Schlagzeilen | https://taz.de/!p4608;rss/ | (–) | Sonderzeichen in Readern |
| heise — News (Atom) | https://www.heise.de/rss/heise-atom.xml | ✓ | Tech/Industrie |
| heise — News (RDF) | https://www.heise.de/rss/heise.rdf | ✓ | Duplikat möglich |
| Business Insider DE | https://www.businessinsider.de/xml/rss.xml | (–) | DNS im Agenten-Check problematisch |
| WiWo | https://www.wiwo.de/contentexport/feed/rss | (–) | zu verifizieren |
| Handelsblatt — Finanzen | https://rss.handelsblatt.com/content/xml/finanzen.xml | ⚠ | DNS-Fehler im Sandbox-Check |
| RND — Wirtschaft | https://www.rnd.de/arc/outboundfeeds/rss/category/wirtschaft/ | (–) | Redaktionsnetzwerk |
| RND — Politik | https://www.rnd.de/arc/outboundfeeds/rss/category/politik/ | (–) | |
| RND — Panorama | https://www.rnd.de/arc/outboundfeeds/rss/category/panorama/ | (–) | breiter Streuwinkel |
| RP ONLINE — Wirtschaft | https://rp-online.de/wirtschaft/feed.rss | ✓ | Regionalnetzwerk |
| n-tv — alle RSS Hub | https://www.n-tv.de/incoming/RSS-Feeds-von-n-tv-de-article10735026.html | (–) | Meta |
| n-tv — Wirtschaft | https://www.n-tv.de/wirtschaft/rss | (–) | Börsen/Wirtschaft |
| n-tv — Wissenschaft | https://www.n-tv.de/wissen/rss | (–) | |
| WELT — Latest | https://www.welt.de/feeds/latest.rss | (–) | Axel Springer |
| WELT — Top News | https://www.welt.de/feeds/topnews.rss | (–) | |
| WELT — Wirtschaft | https://www.welt.de/feeds/section/wirtschaft.rss | (–) | Muster — auf welt.de/rss prüfen |
| WELT — Feed-Übersicht | https://www.welt.de/services/article157826206/Abonnieren-Sie-die-RSS-Feeds-der-WELT.html | (–) | Meta |

---

## Deutschland — Wirtschaft / Rohstoffe / Industrie (Überregional)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| tagesschau — Wirtschaft gesamt | https://www.tagesschau.de/wirtschaft/index~rss2.xml | ✓ | |
| tagesschau — Finanzen | https://www.tagesschau.de/wirtschaft/finanzen/index~rss2.xml | (–) | ARD-Doku |
| tagesschau — Unternehmen | https://www.tagesschau.de/wirtschaft/unternehmen/index~rss2.xml | (–) | |
| tagesschau — Verbraucher | https://www.tagesschau.de/wirtschaft/verbraucher/index~rss2.xml | (–) | |
| tagesschau — Technologie | https://www.tagesschau.de/wirtschaft/technologie/index~rss2.xml | (–) | |
| tagesschau — Weltwirtschaft | https://www.tagesschau.de/wirtschaft/weltwirtschaft/index~rss2.xml | (–) | |
| tagesschau — Konjunktur | https://www.tagesschau.de/wirtschaft/konjunktur/index~rss2.xml | (–) | |

---

## Deutschland — Wissenschaft / Klima / Umwelt (Überregional)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| tagesschau — Wissen gesamt | https://www.tagesschau.de/wissen/index~rss2.xml | (–) | |
| tagesschau — Klima & Umwelt | https://www.tagesschau.de/wissen/klima/index~rss2.xml | ✓ | stark für Rohstoff-/Akzeptanz-Themen |
| tagesschau — Forschung | https://www.tagesschau.de/wissen/forschung/index~rss2.xml | (–) | |
| tagesschau — Wissen Technologie | https://www.tagesschau.de/wissen/technologie/index~rss2.xml | (–) | |
| tagesschau — Faktenfinder | https://www.tagesschau.de/faktenfinder/index~rss2.xml | (–) | |
| tagesschau — Investigativ | https://www.tagesschau.de/investigativ/index~rss2.xml | (–) | |

---

## Deutschland — Region tagesschau (alle Bundesländer)

| Region | Feed-URL | HTTP |
|--------|----------|------|
| Baden-Württemberg | https://www.tagesschau.de/inland/regional/badenwuerttemberg/index~rss2.xml | ✓ |
| Bayern | https://www.tagesschau.de/inland/regional/bayern/index~rss2.xml | ✓ |
| Berlin | https://www.tagesschau.de/inland/regional/berlin/index~rss2.xml | ✓ |
| Brandenburg | https://www.tagesschau.de/inland/regional/brandenburg/index~rss2.xml | ✓ |
| Bremen | https://www.tagesschau.de/inland/regional/bremen/index~rss2.xml | ✓ |
| Hamburg | https://www.tagesschau.de/inland/regional/hamburg/index~rss2.xml | ✓ |
| Hessen | https://www.tagesschau.de/inland/regional/hessen/index~rss2.xml | ✓ |
| Mecklenburg-Vorpommern | https://www.tagesschau.de/inland/regional/mecklenburgvorpommern/index~rss2.xml | ✓ |
| Niedersachsen | https://www.tagesschau.de/inland/regional/niedersachsen/index~rss2.xml | ✓ |
| NRW | https://www.tagesschau.de/inland/regional/nordrheinwestfalen/index~rss2.xml | ✓ |
| Rheinland-Pfalz | https://www.tagesschau.de/inland/regional/rheinlandpfalz/index~rss2.xml | ✓ |
| Saarland | https://www.tagesschau.de/inland/regional/saarland/index~rss2.xml | ✓ |
| Sachsen | https://www.tagesschau.de/inland/regional/sachsen/index~rss2.xml | ✓ |
| Sachsen-Anhalt | https://www.tagesschau.de/inland/regional/sachsenanhalt/index~rss2.xml | ✓ |
| Schleswig-Holstein | https://www.tagesschau.de/inland/regional/schleswigholstein/index~rss2.xml | ✓ |
| Thüringen | https://www.tagesschau.de/inland/regional/thueringen/index~rss2.xml | ✓ |

---

## Deutschland — Südwest / Oberrhein (Pipeline-Zusatz, Thermalsole-Lithium)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| RP ONLINE — Rheinland-Pfalz | https://rp-online.de/rheinland-pfalz/feed.rss | ✓ | RLP-Ressort |
| RP ONLINE — Wirtschaft | https://rp-online.de/wirtschaft/feed.rss | ✓ | VRM-Wirtschaft |
| Pfalz-Express | https://www.pfalz-express.de/feed/ | ✓ | Landau / Südliche Weinstraße |
| Volksfreund | https://www.volksfreund.de/feed.rss | ✓ | Trier / Südwest-RLP |

---

## Deutschland — Öffentlich-rechtliche Regionalwellen

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| NDR — Start | https://www.ndr.de/index~rss2.xml | (–) | |
| NDR — Niedersachsen | https://www.ndr.de/nachrichten/niedersachsen/index~rss2.xml | ✓ | |
| NDR — Schleswig-Holstein | https://www.ndr.de/nachrichten/schleswig-holstein/index~rss2.xml | (–) | |
| NDR — Hamburg | https://www.ndr.de/nachrichten/hamburg/index~rss2.xml | (–) | |
| NDR — Mecklenburg-Vorpommern | https://www.ndr.de/nachrichten/mecklenburg-vorpommern/index~rss2.xml | (–) | |
| SWR Aktuell (BW+RP) | https://www.swr.de/~rss/index.xml | ✓ | ein gemeinsamer Feed |
| WDR — Nachrichten | https://www1.wdr.de/nachrichten/index.xml | ✓ | NRW |
| rbb24 — Aktuell | https://www.rbb24.de/aktuell/index.xml | ✓ | Berlin/BB |
| rbb24 — Politik | https://www.rbb24.de/politik/index.xml | ✓ | |
| rbb24 — Wirtschaft | https://www.rbb24.de/wirtschaft/index.xml | ✓ | |
| Hessenschau / HR | https://www.hr.de/rss/index.xml | ✓ | |
| MDR — Sachsen-Anhalt | https://www.mdr.de/sachsen-anhalt/verteilseite1524-rss.xml | ✓ | Altmark/Kontext |
| BR24 — Startseite | https://nachrichtenfeeds.br.de/rss/nachrichten/seiten/QXAPkQJ | (–) | BR-Nutzerführung |
| BR24 — Wirtschaft | https://nachrichtenfeeds.br.de/rss/nachrichten/seiten/QXAPwyN | (–) | |
| BR24 — Wissen | https://nachrichtenfeeds.br.de/rss/nachrichten/seiten/QXAPyRp | (–) | |
| BR24 — Netzwelt/Tech | https://nachrichtenfeeds.br.de/rss/nachrichten/seiten/QXAPuSB | (–) | |
| BR24 — Kultur | https://nachrichtenfeeds.br.de/rss/nachrichten/seiten/QXAPqxI | (–) | |
| BR klassischer Pfad | https://www.br.de/nachrichten/meldungen/nachrichten-bayerischer-rundfunk100~newsRss.xml | (–) | ältere BR-Doku |

*(SR Saarland: gesonderter RSS oft instabil — über tagesschau regional Saarland + SWR abdecken.)*

---

## Deutschland — Spezial: Energie/Klima-Journalismus (Engl., aber EU/DE stark)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| Clean Energy Wire | https://www.cleanenergywire.org/rss.xml | ✓ | oft DE-relevante Energie-Rohstoffe |

---

## Deutschland — Bund & Behörden (Open Data / RSS)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| Bundesregierung — Presse Open Data XML | https://www.bundesregierung.de/service/opendata/breg-de/pressemitteilungen-1584990.xml | ✓ | sehr groß — Parsing budgetieren |
| BMWK — Pressemitteilungen RSS | https://www.bundeswirtschaftsministerium.de/SiteGlobals/BMWI/Functions/RSSFeed/DE/RSSFeed-Pressemitteilung.xml | ⚠ | 504 im Kurzcheck |
| BMWK — kompakt | https://www.bundeswirtschaftsministerium.de/SiteGlobals/BMWI/Functions/RSSFeed/DE/RSSFeed-Kompakt.xml | ⚠ | |
| BMWK — Ausschreibungen | https://www.bundeswirtschaftsministerium.de/SiteGlobals/BMWI/Functions/RSSFeed/DE/RSSFeed-Ausschreibungen.xml | (–) | weniger themarelevant |
| Service-Bund Übersichtsseite | https://www.service.bund.de/Content/DE/Home/homepage_node.html | (–) | Portal — konkrete Feed-URLs aus „RSS“ navigieren |

*(BMUV und andere Ministerien: eigene `/RSSFeed/` Pfade auf jeweiliger Site suchen — hier nicht vollständig, um Broken Links zu vermeiden.)*

---

## EU — Europäisches Parlament (Themen DE)

Basis: Topic-Pattern laut EP-Doku `…/rss/topic/<id>/de.xml` — **IDs vor Produktion gegen aktuelle EP-Seite validieren.**

| Thema (Kurz) | Feed-URL | HTTP |
|--------------|----------|------|
| Binnenmarkt & Industrie | http://www.europarl.europa.eu/rss/topic/909/de.xml | (–) |
| Gesundheit & Umwelt | http://www.europarl.europa.eu/rss/topic/911/de.xml | (–) |
| EP Top-Stories DE | https://www.europarl.europa.eu/rss/doc/top-stories/de.xml | ⚠ | 500 im Kurzcheck |
| EP Übersichtsseite RSS | https://www.europarl.europa.eu/at-your-service/de/stay-informed/rss-feeds | (–) | Meta |

---

## EU — Europäische Kommission & Agenturen

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| DG GROW — RSS Übersichtsseite | https://single-market-economy.ec.europa.eu/rss_en | (–) | konkrete Feed-Buttons auf der Seite kopieren |
| EU Kommission — Press corner RSS (EN) | https://ec.europa.eu/commission/presscorner/rss/en.xml | (–) | EN-Fallback für Rohstoff/Batterien |
| ECHA — Nachrichtenfeed | https://echa.europa.eu/-/echa-news-feed/rss | (–) | Chemikalien/Batterie-Stoffe tangential |
| EU Publications Office — RSS Hub | https://op.europa.eu/en/web/webtools/notifications-and-rss | (–) | Meta |

---

## EU — EurActiv (Energy — oft 403 für Bots)

| Outlet | Feed-URL | HTTP | Notiz |
|--------|----------|------|--------|
| EurActiv — Energy | https://www.euractiv.com/section/energy/feed/ | ⚠ | 403 ohne Browser-UA möglich |

---

## Regionalpresse / Vertiefung (manuell kuratieren)

Die folgenden Publisher haben häufig **stadt-/themenbezogene** Feeds — URLs über die jeweilige `/rss`-Hubseite bestätigen:

| Hinweis | Startseite zur Feed-Suche |
|---------|---------------------------|
| LVZ / Leipzig / Sachsen | https://www.lvz.de/rss |
| Mitteldeutsche Zeitung | https://www.mz.de/ (Bereich „RSS“ / Varia-Artikel) |
| Freie Presse (Chemnitz) | Publisher-RSS-Hub suchen |
| Volksstimme (Magdeburg) | Publisher-RSS-Hub suchen |
| Mittelbayerische Regio | z. B. Regio-Pfade unter mittelbayerische.de |

---

## Änderungsprotokoll

| Datum | Änderung |
|-------|----------|
| 2026-05-14 | Große Erstbefüllung mit RSS/XML-Kandidaten + HTTP-Legende |
