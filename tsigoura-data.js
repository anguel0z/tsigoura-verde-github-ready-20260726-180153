/* ============================================================================
   TSIGOURA VERDE RESORT — Shared data
   ----------------------------------------------------------------------------
   ΠΗΓΗ: κλασικός κατάλογος + event pricelist (ημερομηνιακό) (φαγητό + ποτά) — Σεπτέμβριος 2026.
   Ο ψηφιακός κατάλογος ΔΕΙΧΝΕΙ ΜΟΝΟ ό,τι είναι γραμμένο εκεί (και τα
   χειρόγραφα στο ίδιο χαρτί). Τίποτα άλλο.

   ✅ ΑΠΟ ΤΟΝ ΚΑΤΑΛΟΓΟ, ΑΥΤΟΛΕΞΕΙ:
      ονόματα πιάτων (ΕΛ + EN), τιμές, μονάδες (500ml / 1L, 200ml, 250ml),
      κατηγορίες, και οι νομικές δηλώσεις στο τέλος.

   ⛔ ΔΕΝ ΥΠΑΡΧΟΥΝ στον κατάλογο — άρα ΔΕΝ ΥΠΑΡΧΟΥΝ ΕΔΩ:
      περιγραφές πιάτων, αλλεργιογόνα ανά πιάτο, χρόνοι αναμονής,
      "δημοφιλή", "επιλογή σεφ", χορτοφαγικά/πικάντικα, βαθμολογίες.
   ========================================================================== */

/* Admin sets window.TV_STORAGE_KEY before this file loads so owner edits do
   not share the guest catalogue cache (that race hid the special banner). */
const STORAGE_KEY = (typeof window !== 'undefined' && window.TV_STORAGE_KEY)
  ? String(window.TV_STORAGE_KEY)
  : 'tsigoura_verde_v15';  /* bumped — classic returns after rembetika day */
const LIVE_REVISION_KEY = 'tsigoura_verde_live_rev';

const VENUE = {
  name: 'Tsigoura Verde Resort',
  crest: 'TR',
  catalogTitle: { el:'Κατάλογος', en:'Menu', de:'Speisekarte',
                  ro:'Meniu', sr:'Мени', bg:'Меню' },

  /* ⚠️ ΣΥΜΠΛΗΡΩΣΤΕ — δεν τα γνωρίζω, δεν τα εφευρίσκω */
  legal: {
    companyName: '', afm: '', doy: '', gemi: '',
    address: '', phone: '', email: '', mhte: '',
    agoranomikos: 'ΑΓΟΡΑΝΟΜΙΚΟΣ ΥΠΕΥΘΥΝΟΣ: ΜΟΡΑΡΟΥ ΒΙΟΛΕΤΑ',   // ← από τον κατάλογο
  },

  /* Νομικά κείμενα καταλόγου σε όλες τις διαθέσιμες γλώσσες. */
  notices: {
    taxes: {
      el:'Στις τιμές συμπεριλαμβάνονται τα ποσοστά σερβιτόρων και όλοι οι νόμιμοι φόροι.',
      en:'All taxes are included.',
      de:'Alle Steuern sind inbegriffen.',
      ro:'Toate taxele sunt incluse.',
      sr:'Сви порези су укључени.',
      bg:'Всички данъци са включени.' },
    complaints: {
      el:'Το κατάστημα υποχρεούται να διαθέτει έντυπα δελτία, σε ειδική θήκη δίπλα στην έξοδο για τη διατύπωση οποιασδήποτε διαμαρτυρίας.',
      en:'The facility is required to have available preprinted forms, in a special case next to the exit so that any complaint can be expressed.',
      de:'Der Betrieb ist verpflichtet, vorgedruckte Formulare in einem speziellen Behälter neben dem Ausgang bereitzuhalten, damit Beschwerden geäußert werden können.',
      ro:'Unitatea este obligată să dețină formulare pretipărite, într-un suport special lângă ieșire, pentru a putea fi exprimată orice reclamație.',
      sr:'Објекат је дужан да поседује унапред штампане обрасце, у посебном држачу поред излаза, како би се могла изразити било каква жалба.',
      bg:'Заведението е длъжно да разполага с предварително отпечатани формуляри, в специална кутия до изхода, за да може да бъде изразено всякакво оплакване.' },
    allergens: {
      el:'Όλα τα προϊόντα μας μπορεί να περιέχουν αλλεργιογόνα. Σε περίπτωση που έχετε αλλεργίες ή παρουσιάζετε δυσανεξία σε κάποια τρόφιμα, οφείλετε να ενημερώσετε τον σερβιτόρο.',
      en:'All our products may contain allergens. If you have allergies or food intolerances, you must inform the waiter.',
      de:'Alle unsere Produkte können Allergene enthalten. Wenn Sie Allergien oder Unverträglichkeiten haben, müssen Sie den Kellner informieren.',
      ro:'Toate produsele noastre pot conține alergeni. Dacă aveți alergii sau intoleranțe alimentare, trebuie să informați ospătarul.',
      sr:'Сви наши производи могу садржати алергене. Ако имате алергије или интолеранције на храну, морате обавестити конобара.',
      bg:'Всички наши продукти може да съдържат алергени. Ако имате алергии или хранителни непоносимости, трябва да уведомите сервитьора.' },
    thanks: { el:'Ευχαριστούμε!', en:'Thank you!', de:'Danke!', ro:'Mulțumim!', sr:'Хвала!', bg:'Благодарим!' },
  },
};

const LANGUAGES = [
  { code:'el', label:'Ελληνικά', flag:'🇬🇷', verified:true  },
  { code:'en', label:'English',  flag:'🇬🇧', verified:true  },
  { code:'de', label:'Deutsch',  flag:'🇩🇪', verified:true },
  { code:'ro', label:'Română',   flag:'🇷🇴', verified:true },
  { code:'sr', label:'Српски',   flag:'🇷🇸', verified:true },
  { code:'bg', label:'Български',flag:'🇧🇬', verified:true },
];

/* 14 αλλεργιογόνα ΕΕ — η λίστα υπάρχει για να τη ΣΥΜΠΛΗΡΩΣΕΤΕ, όχι για να μαντέψω */
const ALLERGENS = {
  gluten:   { el:'Γλουτένη',        en:'Gluten',        de:'Gluten',        ro:'Gluten',        sr:'Глутен',        bg:'Глутен' },
  crustacea:{ el:'Καρκινοειδή',     en:'Crustaceans',   de:'Krebstiere',    ro:'Crustacee',     sr:'Ракови',        bg:'Ракообразни' },
  eggs:     { el:'Αυγά',            en:'Eggs',          de:'Eier',          ro:'Ouă',           sr:'Јаја',          bg:'Яйца' },
  fish:     { el:'Ψάρια',           en:'Fish',          de:'Fisch',         ro:'Pește',         sr:'Риба',          bg:'Риба' },
  peanuts:  { el:'Αράπικα φιστίκια',en:'Peanuts',       de:'Erdnüsse',      ro:'Arahide',       sr:'Кикирики',      bg:'Фъстъци' },
  soy:      { el:'Σόγια',           en:'Soybeans',      de:'Soja',          ro:'Soia',          sr:'Соја',          bg:'Соя' },
  milk:     { el:'Γάλα',            en:'Milk',          de:'Milch',         ro:'Lapte',         sr:'Млеко',         bg:'Мляко' },
  nuts:     { el:'Ξηροί καρποί',    en:'Tree nuts',     de:'Schalenfrüchte',ro:'Fructe cu coajă',sr:'Језграсти плодови',bg:'Ядки' },
  celery:   { el:'Σέλινο',          en:'Celery',        de:'Sellerie',      ro:'Țelină',        sr:'Целер',         bg:'Целина' },
  mustard:  { el:'Μουστάρδα',       en:'Mustard',       de:'Senf',          ro:'Muștar',        sr:'Слачица',       bg:'Синап' },
  sesame:   { el:'Σουσάμι',         en:'Sesame',        de:'Sesam',         ro:'Susan',         sr:'Сусам',         bg:'Сусам' },
  sulphites:{ el:'Θειώδη',          en:'Sulphites',     de:'Sulfite',       ro:'Sulfiți',       sr:'Сулфити',       bg:'Сулфити' },
  lupin:    { el:'Λούπινο',         en:'Lupin',         de:'Lupinen',       ro:'Lupin',         sr:'Лупина',        bg:'Лупина' },
  molluscs: { el:'Μαλάκια',         en:'Molluscs',      de:'Weichtiere',    ro:'Moluște',       sr:'Мекушци',       bg:'Мекотели' },
};

const NORMAL_CATEGORIES = [
  { id:'appetizers', order:1, icon:'dip',   t:{ el:'Ορεκτικά', en:'Appetizers', de:'Vorspeisen', ro:'Aperitive', sr:'Предјела', bg:'Предястия' } },
  { id:'salads',     order:2, icon:'salad', t:{ el:'Σαλάτες',  en:'Salads',     de:'Salate',     ro:'Salate',    sr:'Салате',   bg:'Салати' } },
  { id:'spit',       order:3, icon:'skewer', hidden:true, accent:'#B4623A', tint:'#F6E6DC', image:'media/dishes/67-lamb-spit-clean.png', t:{ el:'Σούβλες', en:'Spit-roasts', de:'Vom Spieß', ro:'La proțap', sr:'Са ражња', bg:'На шиш' } },
  { id:'meat',       order:4, icon:'meat',  t:{ el:'Κρεατικά', en:'Meat dishes',de:'Vom Grill', ro:'La grătar', sr:'Са роштиља', bg:'Скара' } },
  { id:'drinks',     order:5, icon:'wine',  t:{ el:'Ποτά',     en:'Drinks',     de:'Getränke',   ro:'Băuturi',   sr:'Пића',     bg:'Напитки' } },
  { id:'pizza',      order:6, icon:'pizza', hidden:true, t:{ el:'Πίτσες',   en:'Pizzas',     de:'Pizzen',     ro:'Pizza',     sr:'Пице',     bg:'Пици' } },
];

/* --------------------------------------------------------------------------
   ΜΕΝΟΥ — κάθε γραμμή αντιστοιχεί 1:1 σε γραμμή του έντυπου καταλόγου.
   allergens:[] και desc:'' ΕΠΙΤΗΔΕΣ ΚΕΝΑ. Συμπληρώνονται από το Pro mode.
   -------------------------------------------------------------------------- */
const M = (id,cat,price,unit,icon,el,en,de,ro,sr,bg) => ({
  id, cat, price, unit, icon,
  available:true, allergens:[],
  t:{ el:{n:el,d:''}, en:{n:en,d:''}, de:{n:de,d:''}, ro:{n:ro,d:''}, sr:{n:sr,d:''}, bg:{n:bg,d:''} }
});

const NORMAL_MENU = [
  /* --- Ορεκτικά / Appetizers --- */
  M(101,'appetizers', 5.00,'portion','dip',      'Τζατζίκι χειροποίητο','Homemade Tzatziki','Hausgemachtes Tzatziki','Tzatziki de casă','Домаћи џаџики','Домашно дзадзики'),
  M(102,'appetizers', 5.00,'portion','dip',      'Τυροσαλάτα','Tyrosalata','Tyrosalata','Tyrosalata','Тиросалата','Тиросалата'),
  M(103,'appetizers', 5.00,'portion','cheese',   'Φέτα λαδορίγανη','Feta with Oil & Oregano','Feta mit Öl & Oregano','Feta cu ulei și oregano','Фета са уљем и ориганом','Фета със зехтин и риган'),
  M(104,'appetizers', 5.00,'portion','dip',      'Μελιτζανοσαλάτα','Melitzanosalata','Melitzanosalata','Melitzanosalata','Мелицаносалата','Мелицаносалата'),
  M(105,'appetizers', 8.00,'portion','pot',      'Μπουγιούρντι','Bougourdi','Bougourdi','Bougourdi','Бујурди','Буюрди'),
  M(106,'appetizers', 9.00,'portion','cheese',   'Φέτα σουσάμι μέλι','Feta with Sesame & Honey','Feta mit Sesam & Honig','Feta cu susan și miere','Фета са сусамом и медом','Фета със сусам и мед'),
  M(107,'appetizers', 5.00,'portion','fries',    'Πατάτες τηγανητές','French Fries','Pommes frites','Cartofi prăjiți','Помфрит','Пържени картофи'),
  M(108,'appetizers', 9.00,'portion','zucchini', 'Κολοκυθάκια τηγανητά','Fried Zucchini','Frittierte Zucchini','Dovlecei prăjiți','Пржене тиквице','Пържени тиквички'),
  M(109,'appetizers', 5.00,'portion','dip',      'Ταραμάς','Taramosalata','Taramosalata','Taramosalata','Тарамосалата','Тарамосалата'),
  M(110,'appetizers', 3.00,'portion','pepper',   'Καυτερή πιπεριά','Green Chili Pepper','Scharfe grüne Paprika','Ardei iute verde','Љута зелена паприка','Люта зелена чушка'),
  M(111,'appetizers', 7.50,'portion','pot',      'Φασόλες φούρνου','Baked Giant Beans','Gebackene Riesenbohnen','Fasole mare la cuptor','Печени крупни пасуљ','Печен едър боб'),
  M(112,'appetizers', 7.50,'portion','potato',   'Πατάτες φούρνου','Oven Baked Potatoes','Ofenkartoffeln','Cartofi la cuptor','Печени кромпир','Печени картофи'),
  M(113,'appetizers', 5.00,'portion','fish',     'Αντζούγιες','Salted Anchovies','Gesalzene Sardellen','Anșoa sărate','Слане инћуне','Солена аншоа'),

  /* --- Σαλάτες / Salads --- */
  M(201,'salads',    12.00,'portion','salad',    'Σαλάτα Τσιγγούρα','Tsigoura Salad','Tsigoura-Salat','Salată Tsigoura','Салата Цигура','Салата Цигура'),
  M(202,'salads',     8.00,'portion','salad',    'Αγγουροντομάτα','Cucumber & Tomato','Gurken-Tomaten-Salat','Salată de castraveți și roșii','Салата краставац-парадајз','Салата краставици-домати'),
  M(203,'salads',    10.00,'portion','salad',    'Χωριάτικη','Greek Salad','Griechischer Salat','Salată grecească','Грчка салата','Гръцка салата'),
  M(204,'salads',     8.00,'portion','salad',    'Βραστή ανάμεικτη','Mixed Boiled Vegetables','Gemischtes gekochtes Gemüse','Legume fierte mixte','Мешано кувано поврће','Смесени варени зеленчуци'),
  M(205,'salads',     7.00,'portion','salad',    'Λάχανο-καρότο','Cabbage-Carrot','Kohl-Karotte','Varză-morcov','Купус-шаргарепа','Зеле-морков'),

  /* --- Κρεατικά / Meat --- */
  M(301,'meat',      12.00,'portion','meat',     'Μπριζόλα χοιρινή','Pork Chop','Schweinekotelett','Cotlet de porc','Свињски котлет','Свинска пържола'),
  M(302,'meat',      20.00,'kg',     'meat',     'Μπριζόλα μοσχαρίσια','Beef Chop','Rindersteak','Antricot de vită','Јунећи котлет','Телешка пържола'),
  M(303,'meat',      10.00,'portion','burger',   'Μπιφτέκι','Beef Patty','Rindfleisch-Frikadelle','Chiftea de vită','Плескавица','Кюфте'),
  M(304,'meat',      11.00,'portion','burger',   'Σουτζουκάκι','Soutzoukaki','Soutzoukaki','Chiftele picante','Ћуфте суџукице','Кюфтета суджук'),
  M(305,'meat',      12.00,'portion','drumstick','Μπούτι κοτόπουλο ξεκοκαλισμένο','Boneless Chicken Thigh','Hähnchenschenkel o. Knochen','Pulpă de pui dezosată','Пилећи батак без кости','Обезкостено пилешко бутче'),
  M(306,'meat',      12.00,'portion','drumstick','Φιλέτο κοτόπουλο','Chicken Fillet','Hähnchenfilet','File de pui','Пилећи филе','Пилешко филе'),
  M(307,'meat',      13.00,'portion','skewer',   'Σουβλάκι χοιρινό','Pork Souvlaki','Schweine-Souvlaki','Souvlaki de porc','Свињски ражњић','Свинско сувлаки'),
  M(308,'meat',      14.00,'portion','skewer',   'Σουβλάκι κοτόπουλο','Chicken Souvlaki','Hähnchen-Souvlaki','Souvlaki de pui','Пилећи ражњић','Пилешко сувлаки'),
  M(309,'meat',      12.00,'portion','meat',     'Πανσέτες','Pork Belly','Schweinebauch','Piept de porc','Свињска потрбушина','Свински гърди'),
  M(310,'meat',      15.00,'portion','chop',     'Παϊδάκια αρνήσια','Lamb Chops','Lammkoteletts','Cotlete de miel','Јагњећи котлети','Агнешки котлети'),
  M(311,'meat',      12.00,'portion','chop',     'Παϊδάκια προβατίνα','Mutton Chops','Hammelkoteletts','Cotlete de oaie','Овчији котлети','Овнешки котлети'),
  M(312,'meat',      15.00,'portion','shank',    'Κότσι','Pork Shank','Schweinshaxe','Ciolan de porc','Свињска коленица','Свински джолан'),
  M(313,'spit',      15.00,'portion','skewer',   'Κοντοσούβλι','Kontosouvli','Kontosouvli','Kontosouvli','Контосувли','Контосувли'),
  M(314,'meat',      12.00,'portion','drumstick','Κοτόπουλο σούβλας','Chicken on the Spit','Hähnchen vom Spieß','Pui la proțap','Пилетина на ражњу','Пиле на шиш'),
  M(315,'spit',      55.00,'kg',     'meat',     'Αρνί σούβλας','Lamb on the Spit','Lamm vom Spieß','Miel la proțap','Јагње на ражњу','Агне на шиш'),
  M(316,'meat',      15.00,'portion','fish',     'Μπακαλιάρος με σκορδαλιά','Cod with Garlic Paste','Kabeljau mit Knoblauchcreme','Cod cu pastă de usturoi','Бакалар са белим луком','Треска с чеснова паста'),
  M(317,'meat',       0.00,'portion','meat',     'Tomahawk χοιρινή','Pork Tomahawk','Schweine-Tomahawk','Tomahawk de porc','Свињски tomahawk','Свински tomahawk'),
  M(318,'meat',      12.00,'portion','meat',     'Γύρος','Gyros','Gyros','Gyros','Гирос','Гирос'),
  M(319,'meat',      12.00,'portion','drumstick','Κοτομπουκιές','Chicken Nuggets','Chicken Nuggets','Nuggets de pui','Пилећи нагетси','Пилешки хапки'),

  /* --- Πίτσες / Pizzas --- */
  M(401,'pizza',     10.00,'portion','pizza',    'Μαργαρίτα','Margherita','Margherita','Margherita','Маргарита','Маргарита'),
  M(402,'pizza',     12.00,'portion','pizza',    'Σπέσιαλ','Special','Spezial','Special','Специјал','Специал'),

  /* --- Ποτά / Drinks --- */
  M(501,'drinks',     4.00,'portion','soda',     'Coca-Cola','Coca-Cola','Coca-Cola','Coca-Cola','Кока-Кола','Кока-Кола'),
  M(502,'drinks',     4.00,'portion','soda',     'Fanta Λεμονάδα','Fanta Lemon','Fanta Zitrone','Fanta Lămâie','Фанта лимун','Фанта лимон'),
  M(503,'drinks',     4.00,'portion','soda',     'Fanta Πορτοκαλάδα','Fanta Orange','Fanta Orange','Fanta Portocală','Фанта поморанџа','Фанта портокал'),
  M(504,'drinks',     4.00,'portion','soda',     'Sprite','Sprite','Sprite','Sprite','Спрајт','Спрайт'),
  M(505,'drinks',     4.00,'portion','soda',     'Σόδα','Soda','Soda','Sifon','Сода','Сода'),
  M(506,'drinks',     4.00,'portion','soda',     'Τόνικ','Tonic','Tonic','Apă tonică','Тоник','Тоник'),
  M(507,'drinks',     5.00,'portion','soda',     'Ice Tea Lipton (ροδάκινο/λεμόνι)','Lipton Ice Tea (peach/lemon)','Lipton Eistee (Pfirsich/Zitrone)','Lipton Ice Tea (piersică/lămâie)','Lipton ледени чај (бресква/лимун)','Lipton студен чай (праскова/лимон)'),
  M(508,'drinks',     8.00,'portion','juice',    'Λεμονάδα σπιτική','Homemade Lemonade','Hausgemachte Limonade','Limonadă de casă','Домаћа лимунада','Домашна лимонада'),
  M(509,'drinks',     5.00,'portion','mug',      'Βαρέλι Mythos 400ml','Mythos Draught 400ml','Mythos vom Fass 400ml','Mythos la halbă 400ml','Mythos точено 400ml','Mythos наливна 400ml'),
  M(510,'drinks',     3.50,'portion','mug',      'Βαρέλι Mythos 250ml','Mythos Draught 250ml','Mythos vom Fass 250ml','Mythos la halbă 250ml','Mythos точено 250ml','Mythos наливна 250ml'),
  M(511,'drinks',     5.00,'portion','beer',     'Βεργίνα','Vergina','Vergina','Vergina','Вергина','Вергина'),
  M(512,'drinks',     5.00,'portion','beer',     'Heineken','Heineken','Heineken','Heineken','Хајнекен','Хайнекен'),
  M(513,'drinks',     5.00,'portion','beer',     'Amstel Free','Amstel Free','Amstel Free','Amstel Free','Amstel Free','Amstel Free'),
  M(514,'drinks',     5.00,'portion','wine',     'Ρετσίνα Μαλαματίνα','Malamatina Retsina','Malamatina Retsina','Retsina Malamatina','Рецина Маламатина','Рецина Маламатина'),
  M(515,'drinks',     5.00,'portion','wine',     'Ρετσίνα Γεωργιάδη','Georgiadi Retsina','Georgiadi Retsina','Retsina Georgiadi','Рецина Георгијади','Рецина Георгиади'),
  M(516,'drinks',     6.00,'portion','wine',     'Χύμα ροζέ ημίγλυκο','House Rosé (semi-sweet)','Hausrosé (halbsüß)','Rosé de casă (demidulce)','Домаћи розе (полуслатко)','Домашно розе (полусладко)'),
  M(517,'drinks',     6.00,'portion','wine',     'Χύμα κόκκινο ξηρό','House Red (dry)','Hausrot (trocken)','Roșu de casă (sec)','Домаће црно (суво)','Домашно червено (сухо)'),
  M(518,'drinks',     6.00,'portion','wine',     'Χύμα λευκό ξηρό','House White (dry)','Hausweiß (trocken)','Alb de casă (sec)','Домаће бело (суво)','Домашно бяло (сухо)'),
  M(519,'drinks',    20.00,'portion','wine',     'Ρήγας Κούπα (κόκκινο)','King of Hearts (red)','King of Hearts (rot)','King of Hearts (roșu)','King of Hearts (црвено)','King of Hearts (червено)'),
  M(520,'drinks',    10.00,'portion','drink',    'Ούζο χύμα 200ml','House Ouzo 200ml','Haus-Ouzo 200ml','Ouzo de casă 200ml','Домаћи узо 200ml','Домашно узо 200ml'),
  M(521,'drinks',    10.00,'portion','drink',    'Τσίπουρο χύμα 200ml','House Tsipouro 200ml','Haus-Tsipouro 200ml','Tsipouro de casă 200ml','Домаћи ципуро 200ml','Домашно ципуро 200ml'),
  M(522,'drinks',    12.00,'portion','drink',    'Ηδονικό','Idoniko','Idoniko','Idoniko','Идонико','Идонико'),
  M(523,'drinks',    70.00,'bottle', 'bottle',   'Φιάλη ουίσκι','Whiskey (bottle)','Whisky (Flasche)','Whiskey (sticlă)','Виски (флаша)','Уиски (бутилка)'),
  M(524,'drinks',    70.00,'bottle', 'bottle',   'Φιάλη βότκα','Vodka (bottle)','Wodka (Flasche)','Vodcă (sticlă)','Вотка (флаша)','Водка (бутилка)'),
  M(525,'drinks',    80.00,'bottle', 'bottle',   'Φιάλη ρούμι','Rum (bottle)','Rum (Flasche)','Rom (sticlă)','Рум (флаша)','Ром (бутилка)'),
  M(526,'drinks',    70.00,'bottle', 'bottle',   'Φιάλη Campari','Campari (bottle)','Campari (Flasche)','Campari (sticlă)','Campari (флаша)','Campari (бутилка)'),
  M(527,'drinks',     8.00,'portion','drink',    'Ποτό μερίδα','Spirits (portion)','Spirituosen (Portion)','Tărie (porție)','Жестоко пиће (порција)','Алкохол (порция)'),
];

const EVENT_CATEGORIES = [
  { id:'appetizers', order:1, icon:'dip',   t:{ el:'Ορεκτικά', en:'Appetizers', de:'Vorspeisen', ro:'Aperitive', sr:'Предјела', bg:'Предястия' } },
  { id:'salads',     order:2, icon:'salad', t:{ el:'Σαλάτες',  en:'Salads',     de:'Salate',     ro:'Salate',    sr:'Салате',   bg:'Салати' } },
  { id:'meat',       order:3, icon:'meat',  t:{ el:'Κρεατικά', en:'Meat dishes',de:'Fleischgerichte', ro:'Carne', sr:'Месна јела', bg:'Месни ястия' } },
  { id:'spit',       order:4, icon:'skewer', accent:'#B4623A', tint:'#F6E6DC', image:'media/dishes/68-kontosouvli-clean.png', t:{ el:'Σούβλες', en:'Spit-roasts', de:'Vom Spieß', ro:'La proțap', sr:'Са ражња', bg:'На шиш' } },
  { id:'drinks',     order:5, icon:'drink', t:{ el:'Ποτά', en:'Drinks', de:'Getränke', ro:'Băuturi', sr:'Пића', bg:'Напитки' } },
];

/* --------------------------------------------------------------------------
   ΜΕΝΟΥ — κάθε γραμμή = γραμμή των δύο εντύπων (συμπ. χειρόγραφα).
   allergens:[] και desc:'' ΕΠΙΤΗΔΕΣ ΚΕΝΑ.
   -------------------------------------------------------------------------- */

const EVENT_MENU = [
  /* --- Ορεκτικά / Appetizers (σειρά εντύπου) --- */
  M(103,'appetizers', 5.00,'portion','cheese',   'Φέτα λαδορίγανη','Feta with Olive Oil & Oregano','Feta mit Öl & Oregano','Feta cu ulei și oregano','Фета са уљем и ориганом','Фета със зехтин и риган'),
  M(106,'appetizers', 8.00,'portion','cheese',   'Φέτα με μέλι-σουσάμι','Feta with Honey & Sesame','Feta mit Honig & Sesam','Feta cu miere și susan','Фета са медом и сусамом','Фета с мед и сусам'),
  M(101,'appetizers', 5.00,'portion','dip',      'Τζατζίκι','Tzatziki','Tzatziki','Tzatziki','Џаџики','Дзадзики'),
  M(102,'appetizers', 5.00,'portion','dip',      'Τυροσαλάτα','Cheese Paste','Käsecreme','Pastă de brânză','Тиросалата','Тиросалата'),
  M(104,'appetizers', 5.00,'portion','dip',      'Μελιτζανοσαλάτα','Aubergine Paste','Auberginencreme','Pastă de vinete','Мелицаносалата','Мелицаносалата'),
  M(110,'appetizers', 2.00,'portion','pepper',   'Καυτερή πιπεριά','Green Chili Pepper','Scharfe grüne Paprika','Ardei iute verde','Љута зелена паприка','Люта зелена чушка'),
  M(107,'appetizers', 5.00,'portion','fries',    'Πατάτες τηγανητές','French Fries','Pommes frites','Cartofi prăjiți','Помфрит','Пържени картофи'),
  M(105,'appetizers', 8.00,'portion','pot',      'Μπουγιούρντι','Bouyourdi','Bougourdi','Bougourdi','Бујурди','Буюрди'),

  /* --- Σαλάτες / Salads --- */
  M(201,'salads',    12.00,'portion','salad',    'Σαλάτα Τσιγγούρα','Tsigoura','Tsigoura-Salat','Salată Tsigoura','Салата Цигура','Салата Цигура'),
  M(202,'salads',     7.00,'portion','salad',    'Αγγουροντομάτα','Tomato - Cucumber','Gurken-Tomaten-Salat','Salată de castraveți și roșii','Салата краставац-парадајз','Салата краставици-домати'),
  M(203,'salads',    10.00,'portion','salad',    'Χωριάτικη','Greek Salad','Griechischer Salat','Salată grecească','Грчка салата','Гръцка салата'),

  /* --- Κρεατικά / Meat dishes --- */
  M(303,'meat',      12.00,'portion','burger',   'Μπιφτέκι','Beef Patty','Rindfleisch-Frikadelle','Chiftea de vită','Плескавица','Кюфте'),
  M(304,'meat',      12.00,'portion','burger',   'Σουτζουκάκι','Soutzoukaki','Soutzoukaki','Chiftele picante','Ћуфте суџукице','Кюфтета суджук'),
  M(301,'meat',      13.00,'portion','meat',     'Μπριζόλα χοιρινή','Pork Steak','Schweinekotelett','Cotlet de porc','Свињски котлет','Свинска пържола'),
  M(307,'meat',      13.00,'portion','skewer',   'Σουβλάκι χοιρινό','Pork Souvlaki','Schweine-Souvlaki','Souvlaki de porc','Свињски ражњић','Свинско сувлаки'),
  M(306,'meat',      13.00,'portion','drumstick','Φιλέτο κοτόπουλο','Chicken Fillet','Hähnchenfilet','File de pui','Пилећи филе','Пилешко филе'),

  /* --- Σούβλες / Spit-roasts (χειρόγραφο) --- */
  M(313,'spit',      15.00,'portion','skewer',   'Κοντοσούβλι χοιρινό','Pork Kontosouvli','Schweine-Kontosouvli','Kontosouvli de porc','Свињски контосувли','Свинско контосувли'),
  M(314,'spit',      12.00,'portion','drumstick','Κοτόπουλο σούβλας','Spit-roasted Chicken','Hähnchen vom Spieß','Pui la proțap','Пилетина на ражњу','Пиле на шиш'),

  /* --- Ποτά / Drinks (αναψυκτικά → μπύρες → ρετσίνα → κρασί → ούζο/τσίπουρο) --- */
  M(503,'drinks',     3.00,'portion','soda',     'Πορτοκαλάδα','Orangeade','Orangenlimonade','Portocaladă','Поморанџада','Портокалата'),
  M(508,'drinks',     3.00,'portion','juice',    'Λεμονάδα','Lemonade','Limonade','Limonadă','Лимунада','Лимонада'),
  M(501,'drinks',     3.00,'portion','soda',     'Coca Cola','Coca Cola','Coca Cola','Coca Cola','Coca Cola','Coca Cola'),
  M(531,'drinks',     3.00,'portion','soda',     'Coca Cola Zero','Coca Cola Zero','Coca Cola Zero','Coca Cola Zero','Coca Cola Zero','Coca Cola Zero'),
  M(505,'drinks',     3.00,'portion','soda',     'Σόδα','Soda','Soda','Sifon','Сода','Сода'),

  M(510,'drinks',     4.00,'portion','mug',      'Μύθος βαρέλι 250ml','Draft Mythos 250ml','Mythos vom Fass 250ml','Mythos la halbă 250ml','Mythos точено 250ml','Mythos наливна 250ml'),
  M(509,'drinks',     6.00,'portion','mug',      'Μύθος βαρέλι 400ml','Draft Mythos 400ml','Mythos vom Fass 400ml','Mythos la halbă 400ml','Mythos точено 400ml','Mythos наливна 400ml'),
  M(511,'drinks',     5.00,'portion','beer',     'Βεργίνα','Vergina','Vergina','Vergina','Вергина','Вергина'),

  M(515,'drinks',     6.00,'portion','wine',     'Ρετσίνα Γεωργιάδη','Retsina Georgiadi','Retsina Georgiadi','Retsina Georgiadi','Рецина Георгијади','Рецина Георгиади'),
  M(514,'drinks',     6.00,'portion','wine',     'Ρετσίνα Μαλαματίνα','Retsina Malamatina','Retsina Malamatina','Retsina Malamatina','Рецина Маламатина','Рецина Маламатина'),

  M(518,'drinks',     7.00,'portion','wine',     'Λευκό ξηρό','White Dry','Weiß trocken','Alb sec','Бело суво','Бяло сухо'),
  M(517,'drinks',     7.00,'portion','wine',     'Κόκκινο ξηρό','Red Dry','Rot trocken','Roșu sec','Црвено суво','Червено сухо'),
  M(516,'drinks',     7.00,'portion','wine',     'Ροζέ ημίγλυκο','Rosé Semi Sweet','Rosé halbsüß','Rosé demidulce','Розе полуслатко','Розе полусладко'),

  M(520,'drinks',    12.00,'portion','drink',    'Ούζο','Ouzo','Ouzo','Ouzo','Узо','Узо'),
  M(522,'drinks',    12.00,'200ml',  'drink',    'Ηδονικό τσίπουρο 200ml','Tsipouro 200ml','Tsipouro 200ml','Tsipouro 200ml','Ципуро 200ml','Ципуро 200ml'),
];

/* Διπλές τιμές χύμα κρασιού όπως στο έντυπο: 500ml / 1L */
const PRICE_TEXT = {
  516:'500ml 7€ · 1L 14€',
  517:'500ml 7€ · 1L 14€',
  518:'500ml 7€ · 1L 14€',
};
const DESC = {
  516:{ el:'500ml / 1L', en:'500ml / 1L', de:'500 ml / 1 l', ro:'500 ml / 1 l', sr:'500 ml / 1 l', bg:'500 мл / 1 л' },
  517:{ el:'500ml / 1L', en:'500ml / 1L', de:'500 ml / 1 l', ro:'500 ml / 1 l', sr:'500 ml / 1 l', bg:'500 мл / 1 л' },
  518:{ el:'500ml / 1L', en:'500ml / 1L', de:'500 ml / 1 l', ro:'500 ml / 1 l', sr:'500 ml / 1 l', bg:'500 мл / 1 л' },
};
const INGREDIENTS = {};
const RM = {
  onion:  {el:'κρεμμύδι',       en:'onion',   de:'Zwiebel',   ro:'ceapă',      sr:'црни лук',    bg:'лук'},
  olives: {el:'ελιές',          en:'olives',  de:'Oliven',    ro:'măsline',    sr:'маслине',     bg:'маслини'},
  pepper: {el:'πιπεριά',        en:'pepper',  de:'Paprika',   ro:'ardei',      sr:'паприка',     bg:'чушка'},
  feta:   {el:'φέτα',           en:'feta',    de:'Feta',      ro:'feta',       sr:'фета',        bg:'сирене'},
};
const REMOVABLE = {
  202:['onion'],
  203:['onion','olives','pepper','feta'],
};

NORMAL_MENU.forEach(i=>{
  if(PRICE_TEXT[i.id]) i.priceText = PRICE_TEXT[i.id];
  if(DESC[i.id]){
    LANGUAGES.forEach(l=>{ if(DESC[i.id][l.code]) i.t[l.code].d = DESC[i.id][l.code]; });
  }
  if(INGREDIENTS[i.id]) i.ing = INGREDIENTS[i.id];
  if(REMOVABLE[i.id]) i.removable = REMOVABLE[i.id].map(k=>RM[k]);
});
EVENT_MENU.forEach(i=>{
  if(PRICE_TEXT[i.id]) i.priceText = PRICE_TEXT[i.id];
  if(DESC[i.id]){
    LANGUAGES.forEach(l=>{ if(DESC[i.id][l.code]) i.t[l.code].d = DESC[i.id][l.code]; });
  }
  if(INGREDIENTS[i.id]) i.ing = INGREDIENTS[i.id];
  if(REMOVABLE[i.id]) i.removable = REMOVABLE[i.id].map(k=>RM[k]);
});
/* Brand-new installs: hide Fanta on the classic catalogue only. */
const DEFAULT_HIDDEN_MENU_IDS = new Set([502,503]);
NORMAL_MENU.forEach(i=>{ i.hidden = DEFAULT_HIDDEN_MENU_IDS.has(Number(i.id)); });
EVENT_MENU.forEach(i=>{ i.hidden = false; });

const UNITS = {
  portion:{ el:'', en:'', de:'', ro:'', sr:'', bg:'' },
  kg:     { el:'/κιλό', en:'/kg', de:'/kg', ro:'/kg', sr:'/kg', bg:'/кг' },
  bottle: { el:'/φιάλη', en:'/bottle', de:'/Flasche', ro:'/sticlă', sr:'/флаша', bg:'/бутилка' },
  '200ml':{ el:'/200ml', en:'/200ml', de:'/200ml', ro:'/200ml', sr:'/200ml', bg:'/200мл' },
};

/* Τραπέζια — δείγμα δομής. Ρυθμίζονται πλήρως από τον πίνακα διαχείρισης. */
const DEFAULT_TABLES = [
  { id:'T1', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 1/7', x:5,  y:35, w:9, h:14, shape:'rect' },
  { id:'T2', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 2/7', x:17, y:35, w:9, h:14, shape:'rect' },
  { id:'T3', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 3/7', x:29, y:35, w:9, h:14, shape:'rect' },
  { id:'T4', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 4/7', x:41, y:35, w:9, h:14, shape:'rect' },
  { id:'T5', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 5/7', x:53, y:35, w:9, h:14, shape:'rect' },
  { id:'T6', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 6/7', x:65, y:35, w:9, h:14, shape:'rect' },
  { id:'T7', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 7/7', x:77, y:35, w:9, h:14, shape:'rect' },
  { id:'T8', zone:'outside', seats:8, status:'open', note:'Κάτω αριστερά · 4-8 άτομα', x:4, y:65, w:11, h:22, shape:'rect' },
  { id:'T9', zone:'shop', seats:4, status:'open', note:'Στρογγυλό στη γραμμή του μαγαζιού', x:52, y:54, w:14, h:14, shape:'round' },
];

/* Ζώνες: ονομάστε τες όπως τις λέτε εσείς, από τον πίνακα διαχείρισης. */
const ZONES = {
  outside:{ el:'Έξω', en:'Outside', de:'Draußen', ro:'Exterior', sr:'Напољу', bg:'Отвън' },
  door:{ el:'Πόρτα', en:'Door', de:'Tür', ro:'Ușă', sr:'Врата', bg:'Врата' },
  shop:{ el:'Μαγαζί', en:'Inside', de:'Innen', ro:'Interior', sr:'Унутра', bg:'Вътре' },
  a:{ el:'Ζώνη Α', en:'Zone A', de:'Zone A', ro:'Zona A', sr:'Зона А', bg:'Зона А' },
  b:{ el:'Ζώνη Β', en:'Zone B', de:'Zone B', ro:'Zona B', sr:'Зона Б', bg:'Зона Б' },
};


/* Rembetika event night — after this local calendar day the classic catalogue
   returns automatically (banner window also ends on the same day). */
const EVENT_CATALOGUE_DAY = '2026-09-12';
function localDateKey(at){
  const d = at instanceof Date ? at : new Date();
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function isEventCatalogueDay(at){ return localDateKey(at) === EVENT_CATALOGUE_DAY; }
function activeCatalogVersion(at){
  return isEventCatalogueDay(at)
    ? 'event-pricelist-2026-09-12-rembetika-v10'
    : 'classic-catalog-2026-09-13-v1';
}
function activeDefaultCategories(at){
  return JSON.parse(JSON.stringify(isEventCatalogueDay(at) ? EVENT_CATEGORIES : NORMAL_CATEGORIES));
}
function activeDefaultMenu(at){
  return JSON.parse(JSON.stringify(isEventCatalogueDay(at) ? EVENT_MENU : NORMAL_MENU));
}

/* Ρεμπέτικα — Σάββατο 12/09/26 μόνο. Από 13/09 ο κλασικός κατάλογος επιστρέφει μόνος του. */
const REMBETIKA_ANNOUNCE = {
  on:true, from:'2026-09-12', to:'2026-09-12', fromTime:'', toTime:'', nudge:false,
  theme:'night', accent:'#B99A5B', riv:'', rivMachine:'',
  exclusive:false, exclusiveMode:'with-full', live:true, liveLabel:'ΣΗΜΕΡΑ', fx:true,
  emoji:'', targetCat:'', specialCats:[],
  image:'media/events/rembetika-banner.jpg',
  photo:'media/events/rembetika-photo.jpg',
  logo:'media/events/rembetika-tr.png',
  partnerLogo:'',
  phone:'6985856367',
  entry:'5€',
  doors:'20:30',
  whenEl:'Σάββατο 12/09',
  whenEn:'Sat 12/09',
  t:{
    el:{ title:'Ρεμπέτικα Άσματα', body:'Γαβρήλος Κοκώνας · Σωκράτης Κελαϊδής · Νικόλας Κουρτίδης · Μιχάλης Τζαβέλλας', cta:'Δες τον κατάλογο', kick:'Σήμερα', live:'ΣΗΜΕΡΑ' },
    en:{ title:'Rembetika Songs', body:'Gavriilos Kokonas · Sokratis Kelaidis · Nikolas Kourtides · Michalis Tzavellas', cta:'View the menu', kick:'Tonight', live:'LIVE' },
    de:{ title:'Rembetika Lieder', body:'Gavriilos Kokonas · Sokratis Kelaidis · Nikolas Kourtides · Michalis Tzavellas', cta:'Zur Speisekarte', kick:'Heute', live:'LIVE' },
    ro:{ title:'Cântece rebetiko', body:'Gavriilos Kokonas · Sokratis Kelaidis · Nikolas Kourtides · Michalis Tzavellas', cta:'Vezi meniul', kick:'Azi', live:'LIVE' },
    sr:{ title:'Ребетичка певања', body:'Gavriilos Kokonas · Sokratis Kelaidis · Nikolas Kourtides · Michalis Tzavellas', cta:'Погледај мени', kick:'Данас', live:'LIVE' },
    bg:{ title:'Ребетико песни', body:'Gavriilos Kokonas · Sokratis Kelaidis · Nikolas Kourtides · Michalis Tzavellas', cta:'Виж менюто', kick:'Днес', live:'LIVE' },
  }
};
const CLASSIC_ANNOUNCE = {
  on:false, from:'', to:'', fromTime:'', toTime:'', nudge:true,
  theme:'ember', accent:'', riv:'', rivMachine:'',
  exclusive:false, exclusiveMode:'with-full', live:true, liveLabel:'', fx:true,
  emoji:'🔥', targetCat:'', specialCats:[],
  image:'', photo:'', logo:'', partnerLogo:'', phone:'', entry:'', doors:'', whenEl:'', whenEn:'',
  t:{ el:{title:'',body:'',cta:'',kick:'',live:'',nudge:'',back:''}, en:{title:'',body:'',cta:'',kick:'',live:'',nudge:'',back:''},
      de:{title:'',body:'',cta:'',kick:'',live:'',nudge:'',back:''}, ro:{title:'',body:'',cta:'',kick:'',live:'',nudge:'',back:''},
      sr:{title:'',body:'',cta:'',kick:'',live:'',nudge:'',back:''}, bg:{title:'',body:'',cta:'',kick:'',live:'',nudge:'',back:''} }
};
function activeDefaultAnnouncement(at){
  return JSON.parse(JSON.stringify(isEventCatalogueDay(at) ? REMBETIKA_ANNOUNCE : CLASSIC_ANNOUNCE));
}
const ANNOUNCE = activeDefaultAnnouncement();
const DEFAULT_ANNOUNCEMENT = JSON.parse(JSON.stringify(ANNOUNCE));

const DEFAULT_SETTINGS = {
  serviceOpen:true, acceptOrders:true, currency:'€', defaultLang:'el',
  catalogVersion: activeCatalogVersion(),
  cacheRevision:0,
  cacheSavedAt:0,
  traditionalMenuOnly:true,
  headerActions:{ booking:false, social:true, wifi:true, language:true },
  design:{ accent:'#38564F', showVisualRail:true, categoryArt:true, motion:'rich', showFeaturedHero:true },
  announcement:JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENT)),
  eventPresets:[],
};

/* Compatibility aliases — most call sites still say DEFAULT_MENU / CATEGORIES */
const DEFAULT_CATEGORIES = activeDefaultCategories();
const DEFAULT_MENU = activeDefaultMenu();


/* ---------------- state ---------------- */
function defaultState(){
  return { menu:activeDefaultMenu(),
           categories:activeDefaultCategories(),
           tables:JSON.parse(JSON.stringify(DEFAULT_TABLES)),
           settings:JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
           orders:[], updatedAt:Date.now() };
}
/* Swap rembetika ↔ classic when the calendar day (or catalog bump) changes.
   Keeps only owner-created dishes (id >= 9000). Mutates `state` in place. */
function ensureCatalogueForToday(state, at){
  if(!state || !state.settings) return false;
  const want = activeCatalogVersion(at);
  if(String(state.settings.catalogVersion||'') === want) return false;
  const custom=(Array.isArray(state.menu)?state.menu:[]).filter(i=>{
    const n=Number(i&&i.id);
    return Number.isFinite(n) && n>=9000;
  }).map(i=>JSON.parse(JSON.stringify(i)));
  state.menu = activeDefaultMenu(at).concat(custom);
  state.categories = activeDefaultCategories(at);
  state.settings.catalogVersion = want;
  state.settings.announcement = activeDefaultAnnouncement(at);
  return true;
}
function loadState(){
  try{ const r=localStorage.getItem(STORAGE_KEY); if(!r) return defaultState();
       const base=defaultState(), saved=JSON.parse(r)||{};
       const merged=Object.assign({}, base, saved);
       merged.settings=Object.assign({}, base.settings, saved.settings||{});
       merged.settings.headerActions=Object.assign({}, base.settings.headerActions, (saved.settings&&saved.settings.headerActions)||{});
       merged.settings.design=Object.assign({}, base.settings.design, (saved.settings&&saved.settings.design)||{});
       ensureCatalogueForToday(merged);
       return normalizeState(merged); }catch(e){ return defaultState(); }
}
function normalizeState(s){
  const base=defaultState();
  s.settings=Object.assign({}, base.settings, s.settings||{});
  s.settings.headerActions=Object.assign({}, base.settings.headerActions, s.settings.headerActions||{});
  s.settings.design=Object.assign({}, base.settings.design, s.settings.design||{});
  s.settings.announcement=normalizeAnnouncement(s.settings.announcement||base.settings.announcement);
  s.settings.eventPresets=normalizeEventPresets(s.settings.eventPresets);
  s.menu=Array.isArray(s.menu)?s.menu:base.menu;
  s.categories=(Array.isArray(s.categories)&&s.categories.length)?s.categories:base.categories;
  s.tables=Array.isArray(s.tables)?s.tables:base.tables;
  s.orders=Array.isArray(s.orders)?s.orders:[];
  /* Normalize category ids first, then rebuild the lookup used for dish.cat. */
  s.categories.forEach((c,ix)=>{
    c.id=String(c.id||('cat'+(ix+1))).slice(0,32);
    c.order=Number.isFinite(Number(c.order))?Number(c.order):ix+1;
    c.icon=c.icon||'bowl';
    c.hidden=c.hidden===true;
    c.image=cleanAssetPath(c.image);
    if(c.imageIcon) c.imageIcon=cleanAssetPath(c.imageIcon);
    c.accent=/^#[0-9a-f]{6}$/i.test(String(c.accent||''))?c.accent:null;
    c.tint=/^#[0-9a-f]{6}$/i.test(String(c.tint||''))?c.tint:null;
    c.t=c.t&&typeof c.t==='object'?c.t:{};
    const fallbackCat = c.t.el || c.t.en || c.id;
    LANGUAGES.forEach(l=>{
      const cur=c.t[l.code] || fallbackCat;
      c.t[l.code]=String(typeof cur==='string'?cur:(cur&&cur.n)||fallbackCat).slice(0,40);
    });
  });
  const catIds=new Set(s.categories.map(c=>String(c.id||'')));
  s.menu.forEach((i,ix)=>{
    i.id = i.id || (9000+ix);
    const rawCat=String(i.cat==null?'':i.cat);
    i.cat = catIds.has(rawCat) ? (s.categories.find(c=>String(c.id)===rawCat)||{}).id || rawCat
      : (s.categories[0]&&s.categories[0].id)||'appetizers';
    i.price = Math.max(0, Number(i.price)||0);
    i.unit = i.unit || 'portion';
    i.icon = i.icon || i.art || 'bowl';
    i.image=cleanAssetPath(i.image);
    i.available = i.available!==false;
    i.hidden = i.hidden===true;   /* the admin panel is authoritative — never force this */
    i.schedule = normalizeDishSchedule(i.schedule);
    i.veg = i.veg===true;
    i.spicy = i.spicy===true;
    i.popular = i.popular===true;
    i.chefPick = i.chefPick===true;
    i.allergensReviewed = i.allergensReviewed===true;
    i.allergens = Array.isArray(i.allergens)?i.allergens:[];
    i.removable = Array.isArray(i.removable)?i.removable:[];
    i.t = i.t&&typeof i.t==='object'?i.t:{};
    const fallbackName = (i.t.el&&i.t.el.n) || (i.t.en&&i.t.en.n) || 'Νέο πιάτο';
    LANGUAGES.forEach(l=>{
      const cur=i.t[l.code];
      if(!cur || typeof cur!=='object') i.t[l.code]={n:fallbackName,d:''};
      else { cur.n=String(cur.n||fallbackName).slice(0,90); cur.d=String(cur.d||'').slice(0,220); }
    });
  });
  return s;
}
function cleanAssetPath(v){
  v=String(v||'').trim();
  if(!v) return '';
  if(/^https?:\/\//i.test(v)) return v.slice(0,300);
  v=v.replace(/^\/+/,'').replace(/\\/g,'/');
  if(v.includes('..')) return '';
  return v.slice(0,180);
}
function localDateKey(d){
  d=d instanceof Date?d:new Date(d||Date.now());
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function cleanDateKey(v){
  v=String(v||'').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
}
function normalizeDishSchedule(v){
  v=(v&&typeof v==='object')?v:{};
  let from=cleanDateKey(v.from), to=cleanDateKey(v.to);
  if(from&&to&&from>to){ const swap=from; from=to; to=swap; }
  return {enabled:v.enabled===true&&!!(from||to),from,to};
}
function dishScheduleStatus(i,at){
  const schedule=normalizeDishSchedule(i&&i.schedule);
  const today=localDateKey(at);
  if(!schedule.enabled) return {enabled:false,active:true,upcoming:false,expired:false,today,schedule};
  const upcoming=!!(schedule.from&&today<schedule.from);
  const expired=!!(schedule.to&&today>schedule.to);
  return {enabled:true,active:!upcoming&&!expired,upcoming,expired,today,schedule};
}
function dishGuestVisible(i,at){
  return !!i&&!i.hidden&&dishScheduleStatus(i,at).active;
}
function normalizeEventPresets(value){
  if(!Array.isArray(value)) return [];
  const seen=new Set();
  return value.map((p,ix)=>{
    if(!p||typeof p!=='object') return null;
    let id=String(p.id||('preset-'+(ix+1))).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,48);
    if(!id||seen.has(id)) id='preset-'+(ix+1)+'-'+Date.now().toString(36);
    seen.add(id);
    const itemStates=Array.isArray(p.items)?p.items.map(x=>({
      id:String((x&&x.id)||'').slice(0,40),
      hidden:!!(x&&x.hidden),
      available:!(x&&x.available===false),
      schedule:normalizeDishSchedule(x&&x.schedule)
    })).filter(x=>x.id):[];
    const categoryStates=Array.isArray(p.categories)?p.categories.map(x=>({
      id:String((x&&x.id)||'').slice(0,32),
      hidden:!!(x&&x.hidden)
    })).filter(x=>x.id):[];
    return {
      id,
      name:String(p.name||('Preset '+(ix+1))).trim().slice(0,50),
      createdAt:Number(p.createdAt)||Date.now(),
      items:itemStates,
      categories:categoryStates,
      announcement:normalizeAnnouncement(p.announcement||DEFAULT_ANNOUNCEMENT)
    };
  }).filter(Boolean).slice(0,20);
}
function announcementDateKey(v){
  v=String(v||'').trim().slice(0,10);
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '';
}
/* Looks a special menu can wear. Each one is a full palette, applied to the
   banner, the category chip/card and the ambient wash behind the special menu,
   so a feast night does not look like an ordinary filtered list. */
const ANNOUNCEMENT_THEMES = {
  ember:      { el:'Σούβλες · φωτιά',            emoji:'🔥' },
  assumption: { el:'Δεκαπενταύγουστος · γαλάζιο', emoji:'✨' },
  olive:      { el:'Ταβέρνα · λαδί',              emoji:'🌿' },
  night:      { el:'Βραδινό · σκούρο',            emoji:'🌙' },
  festive:    { el:'Γιορτινό · βυσσινί',          emoji:'🎉' },
};
/* "HH:MM" or '' — an empty time means "no limit on that side of the window". */
function announcementTimeKey(v){
  v=String(v||'').trim().slice(0,5);
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : '';
}
function announcementWindowStatus(a, at){
  const A=(a && typeof a==='object') ? a : {};
  const from=announcementDateKey(A.from);
  const to=announcementDateKey(A.to);
  const fromTime=announcementTimeKey(A.fromTime);
  const toTime=announcementTimeKey(A.toTime);
  const d=at instanceof Date ? at : new Date(at||Date.now());
  const pad=n=>String(n).padStart(2,'0');
  const today=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  const nowTime=pad(d.getHours())+':'+pad(d.getMinutes());
  const out={today, from, to, fromTime, toTime};
  /* Times apply only on the edge days, so a multi-day window stays open
     overnight in between (e.g. 14:00 on the 15th → 02:00 on the 16th). */
  if(from && today<from) return Object.assign(out,{active:false, upcoming:true, expired:false});
  if(from && today===from && fromTime && nowTime<fromTime)
    return Object.assign(out,{active:false, upcoming:true, expired:false});
  if(to && today>to) return Object.assign(out,{active:false, upcoming:false, expired:true});
  if(to && today===to && toTime && nowTime>toTime)
    return Object.assign(out,{active:false, upcoming:false, expired:true});
  return Object.assign(out,{active:true, upcoming:false, expired:false});
}
function normalizeAnnouncement(a){
  const base=JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENT));
  a = (a && typeof a==='object') ? a : {};
  const out=Object.assign({}, base, a);
  out.on = Object.prototype.hasOwnProperty.call(a,'on') ? a.on === true : base.on === true;
  /* Empty from/to = always-on (no date gate). Do NOT force the July-26 sample dates
     back in when the owner clears the fields — that hid banners after they turned them on. */
  if(Object.prototype.hasOwnProperty.call(a,'from')) out.from = announcementDateKey(a.from);
  else out.from = announcementDateKey(base.from);
  if(Object.prototype.hasOwnProperty.call(a,'to')) out.to = announcementDateKey(a.to);
  else out.to = announcementDateKey(base.to);
  if(out.from && out.to && out.from>out.to){ const swap=out.from; out.from=out.to; out.to=swap; }
  /* Time-of-day window on the edge days (e.g. σούβλες served from 14:00). */
  out.fromTime = announcementTimeKey(Object.prototype.hasOwnProperty.call(a,'fromTime') ? a.fromTime : base.fromTime);
  out.toTime   = announcementTimeKey(Object.prototype.hasOwnProperty.call(a,'toTime')   ? a.toTime   : base.toTime);
  /* Guided nudge for guests who would not realise the banner is tappable. */
  out.nudge = Object.prototype.hasOwnProperty.call(a,'nudge') ? a.nudge !== false : base.nudge !== false;
  /* Exclusive: while the window is open the guest sees ONLY the special menu —
     no full catalogue, no way out. Powerful and easy to get wrong, so the guest
     code refuses to honour it unless the chosen categories really have dishes.
     exclusiveMode is the real switch: 'only' | 'with-full'. Older saves wrote
     exclusive:false because the admin toggle did not exist yet — that is NOT
     an opt-out. Opt-out is exclusiveMode==='with-full', written only by the
     new editor. */
  out.exclusiveMode = (String(a.exclusiveMode)==='with-full' || String(a.exclusiveMode)==='only')
    ? String(a.exclusiveMode)
    : 'only';
  out.exclusive = out.exclusiveMode === 'only';
  /* Live badge on the banner ("ΣΗΜΕΡΑ", "LIVE", …) with a breathing dot. */
  out.live = Object.prototype.hasOwnProperty.call(a,'live') ? a.live === true : base.live !== false;
  out.liveLabel = String(a.liveLabel == null ? (base.liveLabel||'') : a.liveLabel).trim().slice(0,24);
  /* Ember particles / sheen on the special surface. Off = still special UI, quiet. */
  out.fx = Object.prototype.hasOwnProperty.call(a,'fx') ? a.fx !== false : base.fx !== false;
  /* Look of the banner and the whole special menu, so each event can carry its
     own character (σούβλες fire, Δεκαπενταύγουστος blue-and-gold, …). */
  out.theme = ANNOUNCEMENT_THEMES[String(a.theme||base.theme||'')] ? String(a.theme||base.theme) : 'ember';
  out.accent = /^#[0-9a-f]{6}$/i.test(String(a.accent||'')) ? String(a.accent) : '';
  /* Optional Rive animation layered over the banner. Only a .riv, and only
     from our own files or an https host — this string ends up driving a
     network fetch, so it is validated rather than trusted. */
  out.riv = (()=>{
    const v = String(a.riv == null ? (base.riv||'') : a.riv).trim().slice(0,300);
    if(!v || !/\.riv(\?.*)?$/i.test(v)) return '';
    if(/^https:\/\/[^\s"'<>]+$/i.test(v)) return v;
    if(/^[A-Za-z0-9._\/-]+$/.test(v) && !v.includes('..')) return v;
    return '';
  })();
  out.rivMachine = String(a.rivMachine||base.rivMachine||'').trim().slice(0,60);
  out.emoji = String(out.emoji||'').slice(0,8);
  out.targetCat = String(out.targetCat||base.targetCat).slice(0,32);
  out.specialCats = Array.isArray(out.specialCats) ? out.specialCats.map(x=>String(x).slice(0,32)).filter(Boolean).slice(0,8) : base.specialCats.slice();
  /* Optional event media — local media/* paths or https only. */
  const safeMedia=(v,fallback='')=>{
    const s=String(v == null ? fallback : v).trim().slice(0,260);
    if(!s) return '';
    if(/^https:\/\/[^\s"'<>]+$/i.test(s)) return s;
    if(/^(media\/|\/)?[A-Za-z0-9._\/-]+$/.test(s) && !s.includes('..')) return s;
    return '';
  };
  out.image = safeMedia(a.image, base.image||'');
  out.photo = safeMedia(a.photo, base.photo||'');
  out.logo = safeMedia(a.logo, base.logo||'');
  out.partnerLogo = safeMedia(a.partnerLogo, base.partnerLogo||'');
  out.phone = String(a.phone == null ? (base.phone||'') : a.phone).replace(/[^\d+]/g,'').slice(0,20);
  out.entry = String(a.entry == null ? (base.entry||'') : a.entry).trim().slice(0,16);
  out.doors = String(a.doors == null ? (base.doors||'') : a.doors).trim().slice(0,8);
  out.whenEl = String(a.whenEl == null ? (base.whenEl||'') : a.whenEl).trim().slice(0,48);
  out.whenEn = String(a.whenEn == null ? (base.whenEn||'') : a.whenEn).trim().slice(0,48);
  out.t = (out.t && typeof out.t==='object') ? out.t : {};
  LANGUAGES.forEach(l=>{
    const cur=(out.t&&out.t[l.code]) || {};
    const fallback=(base.t&&base.t[l.code]) || base.t.en || {title:'',body:''};
    out.t[l.code]={
      title:String(cur.title == null ? (fallback.title || '') : cur.title).slice(0,90),
      body:String(cur.body == null ? (fallback.body || '') : cur.body).slice(0,220),
      /* Empty = guest falls back to the built-in UI string for that language. */
      cta:String(cur.cta == null ? '' : cur.cta).slice(0,60),
      nudge:String(cur.nudge == null ? '' : cur.nudge).slice(0,90),
      kick:String(cur.kick == null ? '' : cur.kick).slice(0,32),
      live:String(cur.live == null ? '' : cur.live).slice(0,24),
      back:String(cur.back == null ? '' : cur.back).slice(0,40)
    };
  });
  return out;
}
function saveState(s){ s.updatedAt=Date.now();
  if(s.settings){
    s.settings.cacheRevision=s.updatedAt;
    s.settings.cacheSavedAt=s.updatedAt;
  }
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    localStorage.setItem(STORAGE_KEY+'_ping', String(s.updatedAt));
    localStorage.setItem(STORAGE_KEY+'_revision', String(s.updatedAt));
  }catch(e){}
}
function resetState(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }
