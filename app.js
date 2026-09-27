/* =========================================================
   Innboard.ai | Hotel housekeeper assistant
   app.js

   1. Helpers, icons, logo
   2. Interface text (KA / EN / RU)
   3. Content data (KA / EN / RU)
   4. Language + theme
   5. Schedule model
   6. Views (app screens)
   7. Router
   8. Interactions
   9. Start-up
   ========================================================= */
(function(){
'use strict';

/* ---------- 1. Helpers ---------- */
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS_LANG='innboard_lang', LS_THEME='innboard_theme';
const store={
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
};

/* Icon paths (24x24 stroke icons from the design) */
const P={
back:'<path d="M15 18l-6-6 6-6"/>',right:'<path d="M9 18l6-6-6-6"/>',down:'<path d="M6 9l6 6 6-6"/>',
camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
cart:'<path d="M5 10h14v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M8 10V6h8v4"/><circle cx="8" cy="21" r="1"/><circle cx="16" cy="21" r="1"/>',
flask:'<path d="M9 3h6"/><path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
bulb:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
list:'<path d="M11 6h10M11 12h10M11 18h10"/><path d="M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/>',
mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
home:'<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
check:'<path d="M20 6L9 17l-5-5"/>',x:'<path d="M18 6L6 18M6 6l12 12"/>',
play:'<path d="M8 5v14l11-7z" fill="currentColor"/>',
send:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
expand:'<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
alert:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
star:'<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z"/>',
doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
spray:'<path d="M7 11h7l1 10H6z"/><path d="M8.5 11V7h4v4"/><path d="M12.5 7h3l-1-3h-5"/><path d="M18 5h3M18 8.5l2.5 1"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
};
const ic=(n,c)=>'<svg class="ic'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+P[n]+'</svg>';

/* Brand logo: roof (inn) over a checklist board, with an AI sparkle */
const LOGO='<svg viewBox="0 0 200 200" role="img" aria-label="Innboard.ai"><rect x="2" y="2" width="196" height="196" rx="46" fill="#0b0b0c" stroke="#2e2e33" stroke-width="2"/><g transform="translate(34 18) scale(.66)"><path d="M40 98 L100 46 L160 98" fill="none" stroke="#ff6a1a" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 124 l10 10 l19 -21" fill="none" stroke="#ffa066" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M108 125 H138" stroke="#ff6a1a" stroke-width="10" stroke-linecap="round"/><path d="M62 152 H138" stroke="#ff6a1a" stroke-width="10" stroke-linecap="round"/><path d="M156 26 q2 12 14 14 q-12 2 -14 14 q-2 -12 -14 -14 q12 -2 14 -14z" fill="#fff"/></g><text x="100" y="166" text-anchor="middle" font-family="Poppins,Segoe UI,sans-serif" font-size="26" font-weight="500" fill="#f6f5f3">Innboard<tspan fill="#ff6a1a">.ai</tspan></text></svg>';
/* Icon only, for small sizes (header, footer, app bar) */
const ICON='<svg viewBox="0 0 200 200" role="img" aria-label="Innboard.ai"><rect x="2" y="2" width="196" height="196" rx="46" fill="#0b0b0c" stroke="#2e2e33" stroke-width="2"/><path d="M40 98 L100 46 L160 98" fill="none" stroke="#ff6a1a" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 124 l10 10 l19 -21" fill="none" stroke="#ffa066" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M108 125 H138" stroke="#ff6a1a" stroke-width="10" stroke-linecap="round"/><path d="M62 152 H138" stroke="#ff6a1a" stroke-width="10" stroke-linecap="round"/><path d="M156 26 q2 12 14 14 q-12 2 -14 14 q-2 -12 -14 -14 q12 -2 14 -14z" fill="#fff"/></svg>';

/* Example photo used by "try an example" (wine stain on marble) */
const EX_IMG='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="#ece9e2"/><path d="M0 60 C80 40 120 110 300 70" stroke="#c9c3b8" stroke-width="3" fill="none"/><path d="M0 150 C90 120 170 170 300 130" stroke="#d6d0c6" stroke-width="2" fill="none"/><ellipse cx="130" cy="105" rx="58" ry="34" fill="#8e2f4a" opacity=".85"/><circle cx="205" cy="80" r="9" fill="#8e2f4a" opacity=".7"/></svg>');

/* Small template helpers */
const B=(attrs,inner,cls)=>'<a class="'+cls+'" role="button" tabindex="0" '+attrs+'>'+inner+'</a>';
const A=(route,inner,cls,extra)=>'<a class="'+(cls||'')+'" href="#/'+route+'"'+(extra?' '+extra:'')+'>'+inner+'</a>';

/* =========================================================
   2. INTERFACE TEXT
   Every entry is  key: [Georgian, English, Russian]
   A null Georgian value means the Georgian text lives in
   index.html and is read from there on start-up.
   ========================================================= */
const S={
/* accessibility + navigation */
'a11y.skip':[null,'Skip to content','Перейти к содержанию'],
'a11y.lang':[null,'Language','Язык'],
'a11y.theme':[null,'Switch theme','Сменить тему'],
'a11y.menu':[null,'Menu','Меню'],
'nav.home':[null,'Home','Главная'],
'nav.features':[null,'Features','Возможности'],
'nav.app':[null,'Assistant','Ассистент'],
'nav.manager':[null,'Manager panel','Панель менеджера'],
'nav.about':[null,'About','О нас'],
'nav.contact':[null,'Contact','Контакты'],
'nav.login':[null,'Sign in','Войти'],
'foot.site':[null,'Website','Сайт'],
'nf.t':[null,'Page not found','Страница не найдена'],
'nf.d':[null,'The link may have changed or been removed.','Ссылка могла измениться или быть удалена.'],
'nf.back':[null,'Back to home','На главную'],

/* welcome / home */
'welcome.hero':[null,'Smart assistant for hotel housekeepers','Умный ассистент горничной отеля'],
'welcome.lead':[null,'The right chemical for the matching surface. Take a photo and AI will tell you what to clean and how','Правильная химия для подходящей поверхности. Сделайте фото, и AI подскажет, что и как очистить'],
'welcome.chip1':['ფოტო-ანალიზი','Photo analysis','Фотоанализ'],
'welcome.chip2':['ქიმია და ზედაპირები','Chemicals and surfaces','Химия и поверхности'],
'welcome.chip3':[null,'AI assistant','AI-ассистент'],
'welcome.pickLang':[null,'Choose a language','Выберите язык'],
'welcome.start':['დაწყება','Get started','Начать'],
'welcome.agree':[null,'By continuing you agree to the','Продолжая, вы принимаете'],
'welcome.terms':[null,'terms and conditions','правила и условия'],
'home.seeFeatures':[null,'See the features','Смотреть возможности'],
'home.ctaT':['ფოტო-შემოწმება','Photo check','Фотопроверка'],
'home.ctaD':['გადაუღე ზედაპირს წმენდამდე და გაიგე, რა ქიმია შეიძლება','Photograph the surface before cleaning and find out which chemicals are safe','Сфотографируйте поверхность до уборки и узнайте, какая химия допустима'],
'home.dirs':['მიმართულებები','Sections','Разделы'],
'home.voiceT':['ჰკითხე AI ასისტენტს ხმით','Ask the AI assistant by voice','Спросите AI-ассистента голосом'],
'home.voiceD':['მაგ. „რით მოვაშორო კირი გრანიტს?“','e.g. "How do I remove limescale from granite?"','напр. «Чем убрать известковый налёт с гранита?»'],
'feat.big':[null,'Features','Возможности'],
'feat.lead':[null,'Everything a housekeeper and a manager need during a shift, in one place.','Всё, что нужно горничной и менеджеру в течение смены, в одном месте.'],
'feat.open':['გახსნა','Open','Открыть'],
'feat.std':['სრული და სწრაფი დალაგება ნაბიჯ-ნაბიჯ, ვიდეო-მაგალითებით.','Full and quick room cleaning step by step, with video examples.','Полная и быстрая уборка шаг за шагом, с видеопримерами.'],
'feat.ai':['დაწერე კითხვა ან ატვირთე ფოტო და გაიგე, რით და როგორ გაწმინდო. ვარჯიშები ცოდნის შესამოწმებლად.','Type a question or upload a photo to learn what to clean with and how. Practice quizzes to test your knowledge.','Задайте вопрос или загрузите фото и узнайте, чем и как чистить. Упражнения для проверки знаний.'],
'feat.mhome':['დღის სტატისტიკა, ფოტო-შემოწმებები, გუნდის კითხვები და AI-ს შემოთავაზებული პასუხები.','Daily stats, photo checks, team questions and AI suggested replies.','Статистика дня, фотопроверки, вопросы команды и ответы, предложенные AI.'],

/* about + contact (Georgian in index.html) */
'about.big':[null,'A smart assistant for the hotel team','Умный ассистент для команды отеля'],
'about.missionT':[null,'Our goal','Наша цель'],
'about.missionD':[null,'The housekeeper photographs the surface and the product, and AI says within seconds whether it can be used. The manager sees the checks, sets priorities and plans the workload.','Горничная фотографирует поверхность и средство, а AI за секунды говорит, можно ли его использовать. Менеджер видит проверки, задаёт приоритеты и планирует нагрузку.'],
'about.whoT':[null,'Who it is for','Для кого'],
'about.who1':[null,'Housekeepers who need a fast, accurate answer right in the room','Для горничных, которым нужен быстрый и точный ответ прямо в номере'],
'about.who2':[null,'Managers who control quality and team workload','Для менеджеров, которые следят за качеством и нагрузкой команды'],
'about.who3':[null,'Hotels that want to protect expensive surfaces','Для отелей, которые хотят сохранить дорогие поверхности'],
'about.valuesT':[null,'Our principles','Наши принципы'],
'about.ctaT':[null,'Want Innboard.ai in your hotel?','Хотите Innboard.ai в своём отеле?'],
'about.ctaD':[null,'Write to us and we will show you how it works in your hotel.','Напишите нам, и мы покажем, как это работает в вашем отеле.'],
'contact.big':[null,'Get in touch','Свяжитесь с нами'],
'contact.lead':[null,'Have a question or want Innboard.ai in your hotel? Fill in the form and we will reply soon.','Есть вопрос или хотите Innboard.ai в своём отеле? Заполните форму, и мы скоро ответим.'],
'contact.name':[null,'Name','Имя'],
'contact.hotel':[null,'Hotel name','Название отеля'],
'contact.email':[null,'Email','Эл. почта'],
'contact.msg':[null,'Message','Сообщение'],
'contact.emailPh':[null,'[email]','[эл. почта]'],
'contact.addr':[null,'Address','Адрес'],
'contact.addrPh':[null,'[address]','[адрес]'],
'contact.hoursT':[null,'Working hours','Часы работы'],
'contact.hours':[null,'Monday to Friday · 10:00-19:00','Понедельник - пятница · 10:00-19:00'],
'contact.req':['შეავსე ეს ველი','Please fill in this field','Заполните это поле'],
'contact.badEmail':['ელ-ფოსტა არასწორია','Email address is not valid','Неверный адрес эл. почты'],
'contact.sent':['შეტყობინება გაიგზავნა. მალე გიპასუხებთ','Message sent. We will reply soon','Сообщение отправлено. Мы скоро ответим'],

/* terms */
'terms.t':['წესები და პირობები','Terms and conditions','Правила и условия'],
'terms.lead':[null,'This page is a template. Write your service terms here.','Эта страница - шаблон. Впишите сюда условия своего сервиса.'],
'terms.h1':[null,'1. Service description','1. Описание сервиса'],
'terms.c1':['Innboard.ai ეხმარება სასტუმროს თანამშრომლებს ზედაპირისთვის სწორი ქიმიისა და ინსტრუმენტის შერჩევაში.','Innboard.ai helps hotel staff choose the right chemicals and tools for each surface.','Innboard.ai помогает сотрудникам отеля подобрать правильную химию и инструмент для поверхности.'],
'terms.h2':[null,'2. Personal data','2. Персональные данные'],
'terms.c2':[null,'The phone number is used only for signing in. Photos are stored in the hotel account.','Номер телефона используется только для входа. Фото хранятся в аккаунте отеля.'],
'terms.h3':[null,'3. Responsibility','3. Ответственность'],
'terms.c3':[null,'AI advice is supportive. If in doubt, ask your manager.','Совет AI носит вспомогательный характер. В сомнительных случаях обратитесь к менеджеру.'],

/* login */
'login.big':[null,'Sign in with phone','Вход по телефону'],
'login.lead':[null,'Enter your number and we will send a 4-digit code by SMS','Укажите номер, и мы отправим 4-значный код по SMS'],
'login.label':['ტელეფონის ნომერი','Phone number','Номер телефона'],
'login.info':[null,'You can sign in with the number your manager added. Number not found? Contact your manager','Войти можно с номером, который добавил ваш менеджер. Номер не найден? Обратитесь к менеджеру'],
'login.get':[null,'Get code','Получить код'],
'otp.big':[null,'Enter the code','Введите код'],
'otp.sent':[null,'The code was sent to','Код отправлен на номер'],
'otp.change':[null,'Change','Изменить'],
'otp.resend':[null,'Did not get the code? Resend','Не пришёл код? Отправить снова'],
'otp.now':['ახლა შეიძლება','available now','можно сейчас'],
'otp.confirm':[null,'Confirm','Подтвердить'],
'role.big':['ვინ ხარ სასტუმროში?','What is your role at the hotel?','Кто вы в отеле?'],
'role.lead':[null,'[Hotel name] · choose your role','[Название отеля] · выберите свою роль'],
'role.hk':['დიასახლისი','Housekeeper','Горничная'],
'role.hkD':['ფოტო-შემოწმება, ქიმია, სტანდარტები, მენეჯერის დავალებები','Photo check, chemicals, standards, manager tasks','Фотопроверка, химия, стандарты, задачи менеджера'],
'role.mg':['მენეჯერი','Manager','Менеджер'],
'role.mgD':['პრიორიტეტები, რეკომენდაციები, კითხვებზე პასუხი','Priorities, recommendations, answers to questions','Приоритеты, рекомендации, ответы на вопросы'],
'role.hint':['როლს მენეჯერი ანიჭებს თანამშრომლის დამატებისას','The manager assigns the role when adding a team member','Роль назначает менеджер при добавлении сотрудника'],

/* shared */
'back':['უკან','Back','Назад'],
'tab.home':['მთავარი','Home','Главная'],
'tab.photo':['ფოტო','Photo','Фото'],
'tab.chem':['ქიმია','Chemicals','Химия'],
'tab.sched':['განრიგი','Schedule','График'],
'tab.profile':['პროფილი','Profile','Профиль'],
'tab.send':['გაგზავნა','Send','Отправить'],
'tab.standards':['სტანდარტები','Standards','Стандарты'],
'toast.reqMgr':['მოთხოვნა მენეჯერს გაეგზავნა','Request sent to the manager','Запрос отправлен менеджеру'],
'lv.low':['დაბალი','Low','Низкая'],
'lv.mid':['საშუალო','Medium','Средняя'],
'lv.high':['მაღალი','High','Высокая'],
'prio.high':['მაღალი','High','Высокий'],
'prio.mid':['საშუალო','Medium','Средний'],
'prio.low':['დაბალი','Low','Низкий'],
'u.min':['წთ','min','мин'],
'u.h':['სთ','h','ч'],
'd.today':['დღეს','Today','Сегодня'],
'd.tomorrow':['ხვალ','Tomorrow','Завтра'],
'side.hk':['დიასახლისი','Housekeeper','Горничная'],
'side.mg':['მენეჯერი','Manager','Менеджер'],
'video.see':['ნახე ვიდეოში','Watch the video','Смотреть видео'],
'video.stepSub':['YouTube · ამ ნაბიჯის მაგალითები','YouTube · examples of this step','YouTube · примеры этого шага'],
'video.ex':['ვიდეო-მაგალითი','Video example','Видеопример'],
'video.exSub':['YouTube · გაიხსნება ახალ ფანჯარაში','YouTube · opens in a new window','YouTube · откроется в новом окне'],

/* page titles */
'title.dashboard':['დიასახლისის მთავარი','Housekeeper home','Главная горничной'],
'title.photo':['ფოტო-ანალიზი','Photo analysis','Фотоанализ'],
'title.chem':['ქიმია და ზედაპირები','Chemicals and surfaces','Химия и поверхности'],
'title.household':['სახლის ქიმია','Household chemicals','Бытовая химия'],
'title.mech':['მექანიკური წმენდა','Mechanical cleaning','Механическая чистка'],
'title.standards':['დალაგების სტანდარტები','Cleaning standards','Стандарты уборки'],
'title.recs':['მენეჯერის რეკომენდაციები','Manager recommendations','Рекомендации менеджера'],
'title.sanitary':['სანიტარული ნორმები','Sanitary rules','Санитарные нормы'],
'title.exp':['სხვა ობიექტების გამოცდილება','Experience from other hotels','Опыт других объектов'],
'title.restore':['ზედაპირის აღდგენა','Surface restoration','Восстановление поверхности'],
'title.ai':['AI ასისტენტი','AI assistant','AI-ассистент'],
'title.profile':['პროფილი','Profile','Профиль'],
'title.sched':['ჩემი განრიგი','My schedule','Мой график'],
'title.manager':['მენეჯერის მთავარი','Manager home','Главная менеджера'],
'title.msched':['განრიგი და დატვირთვა','Schedule and workload','График и нагрузка'],
'title.msend':['ახალი გაგზავნა','New message','Новое сообщение'],

/* dashboard tiles */
'tile.sanitary':['სანიტარული ნორმები','Sanitary rules','Санитарные нормы'],
'tile.sanitary.s':['ჰიგიენა · უსაფრთხოება','Hygiene · safety','Гигиена · безопасность'],
'tile.mech':['მექანიკური წმენდა და ინსტრუმენტები','Mechanical cleaning and tools','Механическая чистка и инструменты'],
'tile.mech.s':['ფერადი კოდი · ინსტრუმენტები','Color code · tools','Цветовой код · инструменты'],
'tile.chem':['ქიმია და ზედაპირები','Chemicals and surfaces','Химия и поверхности'],
'tile.chem.s':['მთავარი · ქვა, ავეჯი, ლითონი','Core · stone, furniture, metal','Основное · камень, мебель, металл'],
'tile.exp':['სხვა ობიექტების გამოცდილება','Experience from other hotels','Опыт других объектов'],
'tile.exp.s':['რეალური შემთხვევები','Real cases','Реальные случаи'],
'tile.photo':['ფოტო-ანალიზი','Photo analysis','Фотоанализ'],
'tile.photo.s':['AI · წმენდის დაწყებამდე','AI · before you clean','AI · до начала уборки'],
'tile.recs':['მენეჯერის რეკომენდაციები','Manager recommendations','Рекомендации менеджера'],
'tile.recs.s':['პრიორიტეტები · კითხვა','Priorities · questions','Приоритеты · вопросы'],
'tile.restore':['დაზიანებული ზედაპირის აღდგენა','Restoring damaged surfaces','Восстановление повреждённой поверхности'],
'tile.restore.s':['ექსპერტის რჩევა','Expert advice','Совет эксперта'],
'tile.standards':['დალაგების სტანდარტები','Cleaning standards','Стандарты уборки'],
'tile.standards.s':['ნაბიჯ-ნაბიჯ · ვიდეო','Step by step · video','Шаг за шагом · видео'],
'tile.sched':['ჩემი განრიგი და დატვირთვა','My schedule and workload','Мой график и нагрузка'],
'tile.sched.s':['კალენდარი · გეგმა','Calendar · plan','Календарь · план'],
'tile.household':['სახლის ქიმია - როცა პროფესიული არ გაქვს','Household chemicals when you have no professional product','Бытовая химия, когда нет профессиональной'],
'tile.household.s':['დროებითი გამოსავალი','Temporary solution','Временное решение'],

/* housekeeper dashboard */
'dash.bell':['შეტყობინებები','Notifications','Уведомления'],
'dash.hello':['გამარჯობა, [სახელი]','Hello, [Name]','Здравствуйте, [Имя]'],
'dash.sub':['[სასტუმროს სახელი] · დიასახლისი · დღევანდელი ცვლა','[Hotel name] · housekeeper · today\'s shift','[Название отеля] · горничная · сегодняшняя смена'],
'dash.prioT':['მენეჯერის პრიორიტეტი','Manager priority','Приоритет менеджера'],
'dash.prioTxt':['ოთახი <b>204</b> - ღვინის ლაქა მარმარილოს მაგიდაზე. ჯერ ფოტო-შემოწმება, მჟავა საშუალება არ გამოიყენო.','Room <b>204</b>: wine stain on a marble table. Do a photo check first and do not use an acidic product.','Номер <b>204</b>: пятно от вина на мраморном столе. Сначала фотопроверка, кислотное средство не использовать.'],
'dash.prioM':['[მენეჯერის სახელი] · 10 წთ-ის წინ','[Manager name] · 10 min ago','[Имя менеджера] · 10 мин назад'],
'dash.next':['შემდეგი ცვლა','Next shift','Следующая смена'],
'dash.rooms':['ოთახი','rooms','номеров'],
'dash.lowNote':['ნაკლები დატვირთვის დღეა - დაგეგმილია გეგმიური სამუშაო','A lighter day: planned maintenance is scheduled','День с меньшей нагрузкой: запланированы плановые работы'],

/* photo check */
'photo.big':['შეამოწმე წმენდამდე: ზედაპირი + ქიმია','Check before cleaning: surface + chemical','Проверьте до уборки: поверхность + химия'],
'photo.lead':['გადაუღე დაბინძურებას და ქიმიურ საშუალებას, რომლის გამოყენებასაც აპირებ. AI გეტყვის, შეიძლება თუ არა მისი გამოყენება ამ ზედაპირზე.','Photograph the stain and the product you plan to use. AI will tell you whether it can be used on this surface.','Сфотографируйте загрязнение и средство, которое собираетесь использовать. AI скажет, можно ли применять его на этой поверхности.'],
'photo.s1t':['1 · დაბინძურება','1 · Stain','1 · Загрязнение'],
'photo.s1d':['ზედაპირი და ლაქა ახლოდან','Surface and stain up close','Поверхность и пятно крупным планом'],
'photo.s2t':['2 · ქიმიური საშუალება','2 · Chemical product','2 · Химическое средство'],
'photo.s2d':['ეტიკეტი ისე, რომ შემადგენლობა იკითხებოდეს','The label, with the ingredients readable','Этикетка так, чтобы читался состав'],
'photo.tag1':['✓ დაბინძურება','✓ Stain','✓ Загрязнение'],
'photo.tag2':['✓ საშუალება','✓ Product','✓ Средство'],
'photo.alt1':['დაბინძურების ფოტო','Photo of the stain','Фото загрязнения'],
'photo.alt2':['საშუალების ფოტო','Photo of the product','Фото средства'],
'photo.name':['ან დაწერე საშუალების სახელი','or type the product name','или впишите название средства'],
'photo.run':['შეამოწმე: გამოვიყენო თუ არა?','Check: can I use it?','Проверить: использовать или нет?'],
'photo.tipsT':['კარგი ფოტოსთვის','For a good photo','Для хорошего фото'],
'photo.tip1':['კარგი განათება, ანარეკლის გარეშე','Good light, no glare','Хорошее освещение, без бликов'],
'photo.tip2':['ლაქა კადრის ცენტრში, 20-30 სმ მანძილიდან','Stain in the center of the frame, from 20-30 cm','Пятно в центре кадра, с расстояния 20-30 см'],
'photo.tip3':['საშუალების ეტიკეტი - შემადგენლობის მხარე, მკვეთრად','Product label: the ingredients side, in sharp focus','Этикетка средства: сторона с составом, резко'],
'photo.or':['ან','or','или'],
'photo.tryEx':['სცადე მაგალითით','Try an example','Попробуйте пример'],
'photo.exT':['ღვინის ლაქა მარმარილოზე + ლიმონმჟავიანი კირის საწმენდი','Wine stain on marble + citric acid limescale remover','Пятно от вина на мраморе + средство от налёта с лимонной кислотой'],
'photo.anl':['AI აანალიზებს ფოტოებს…','AI is analyzing the photos…','AI анализирует фото…'],
'photo.need':['ჯერ გადაუღე დაბინძურებას და საშუალებას','First photograph the stain and the product','Сначала сфотографируйте загрязнение и средство'],
'photo.readErr':['ფოტოს წაკითხვა ვერ მოხერხდა','Could not read the photo','Не удалось прочитать фото'],
'verdict.no':['არ გამოიყენო','Do not use','Не используйте'],
'verdict.yes':['შეიძლება გამოიყენო','You can use it','Можно использовать'],
'verdict.caution':['სიფრთხილით - ჯერ შეამოწმე','With caution: check first','С осторожностью: сначала проверьте'],
'verdict.conf':['სანდოობა','Confidence','Достоверность'],
'verdict.surface':['ზედაპირი','Surface','Поверхность'],
'verdict.stain':['დაბინძურება','Stain','Загрязнение'],
'verdict.product':['საშუალება','Product','Средство'],
'verdict.mgr':['მენეჯერის წესი','Manager rule','Правило менеджера'],
'verdict.best':['საუკეთესო ალტერნატივა','Best alternative','Лучшая альтернатива'],
'verdict.instead':['სანაცვლოდ გამოიყენე','Use this instead','Используйте вместо этого'],
'verdict.how':['როგორ გავწმინდო','How to clean','Как очистить'],
'verdict.disc':['ეს AI-ს რჩევაა. ძვირადღირებულ ზედაპირზე საეჭვოდ - ჰკითხე მენეჯერს.','This is AI advice. If in doubt on an expensive surface, ask your manager.','Это совет AI. Если сомневаетесь насчёт дорогой поверхности, спросите менеджера.'],
'verdict.chem':['ქიმიის დეტალები','Chemical details','Подробнее о химии'],
'verdict.hh':['სახლის ქიმია','Household chemicals','Бытовая химия'],
'verdict.restore':['ზედაპირი უკვე დაზიანდა?','Surface already damaged?','Поверхность уже повреждена?'],
'hero.surface':['მარმარილო (კალციტური ქვა), გაპრიალებული','Marble (calcite stone), polished','Мрамор (кальцитовый камень), полированный'],
'hero.instead':['pH-ნეიტრალური ქვის საწმენდი და რბილი მიკროფიბრა; თუ არ გაქვს - ნეიტრალური ჭურჭლის სითხის სუსტი ხსნარი.','pH-neutral stone cleaner and a soft microfiber cloth; if you have none, a weak solution of neutral dish soap.','pH-нейтральное средство для камня и мягкая микрофибра; если его нет, слабый раствор нейтрального средства для посуды.'],

/* chemistry */
'chem.big':['რა ქიმია რომელ ზედაპირზე','Which chemical on which surface','Какая химия для какой поверхности'],
'chem.lead':['არასწორი ქიმია ძვირადღირებულ ზედაპირს შეიძლება სამუდამოდ დააზიანოს. სწორი არჩევანით პრობლემებს ავირიდებთ.','The wrong chemical can permanently damage an expensive surface. The right choice helps us avoid problems.','Неправильная химия может навсегда повредить дорогую поверхность. Правильный выбор помогает избежать проблем.'],
'chem.vsT':['სახლის ქიმია ≠ სამეწარმეო ქიმია','Household chemicals ≠ professional chemicals','Бытовая химия ≠ профессиональная химия'],
'chem.vsHome':['სახლის','Household','Бытовая'],
'chem.vsHomeD':['დაბალი კონცენტრაცია, უცნობი pH, სურნელი და დანამატები. სასტუმროს დაბინძურებას ვერ უმკლავდება და ფენას ტოვებს.','Low concentration, unknown pH, fragrances and additives. Cannot handle hotel soiling and leaves a film.','Низкая концентрация, неизвестный pH, ароматизаторы и добавки. Не справляется с гостиничными загрязнениями и оставляет плёнку.'],
'chem.vsPro':['სამეწარმეო','Professional','Профессиональная'],
'chem.vsProD':['ცნობილი pH და კონცენტრაცია, განზავების ნორმა, ტექნიკური და უსაფრთხოების ფურცელი.','Known pH and concentration, dilution rate, technical and safety data sheet.','Известные pH и концентрация, норма разведения, технический паспорт и паспорт безопасности.'],
'chem.noPro':['პროფესიული საშუალება არ გაქვს?','No professional product?','Нет профессионального средства?'],
'chem.noProD':['როგორ გამოვიყენო სახლის ქიმია უსაფრთხოდ','How to use household chemicals safely','Как безопасно использовать бытовую химию'],
'chem.pick':['აირჩიე ზედაპირი','Choose a surface','Выберите поверхность'],
'chem.ph':['დასაშვები pH','Allowed pH','Допустимый pH'],
'chem.ph0':['0 · მჟავა','0 · acidic','0 · кислотный'],
'chem.ph7':['7 · ნეიტრალური','7 · neutral','7 · нейтральный'],
'chem.ph14':['14 · ტუტე','14 · alkaline','14 · щелочной'],
'chem.use':['გამოიყენე','Use','Используйте'],
'chem.never':['არასოდეს','Never','Никогда'],
'chem.how':['როგორ გავწმინდო','How to clean','Как очистить'],

/* household */
'hh.big':['პროფესიული საშუალება არ გაქვს?','No professional product?','Нет профессионального средства?'],
'hh.lead':['დროებითი, უსაფრთხო გამოსავალი სახლის ქიმიით - კონკრეტული სიტუაციისთვის. ეს არ ანაცვლებს პროფესიულ საშუალებას.','A temporary, safe solution with household chemicals for a specific situation. It does not replace a professional product.','Временное безопасное решение с бытовой химией для конкретной ситуации. Оно не заменяет профессиональное средство.'],
'hh.beforeT':['სანამ დაიწყებ','Before you start','Прежде чем начать'],
'hh.before':['აცნობე მენეჯერს, რომ საშუალება დამთავრდა. ძვირადღირებულ ან უცნობ ზედაპირზე საეჭვო შემთხვევაში - ნუ გარისკავ, დაელოდე.','Tell your manager the product has run out. On an expensive or unknown surface, if in doubt, do not take the risk: wait.','Сообщите менеджеру, что средство закончилось. На дорогой или незнакомой поверхности при сомнении не рискуйте, подождите.'],
'hh.reqBtn':['პროფესიული საშუალების მოთხოვნა','Request a professional product','Запросить профессиональное средство'],
'hh.rulesT':['5 წესი სახლის ქიმიისთვის','5 rules for household chemicals','5 правил для бытовой химии'],
'hh.rules':[['ამოიცანი ზედაპირი - ქვაა, ფილა, ხე თუ ლითონი? საეჭვოა - ჯერ ფოტო-შემოწმება','წაიკითხე ეტიკეტი: მჟავა, ქლორი, ამიაკი თუ აბრაზივი (იხ. ქვემოთ)','სცადე შეუმჩნეველ ადგილზე და დაელოდე 2-3 წუთს','ნაკლები სჯობს - ყოველთვის განზავებით, ბოლოს ჩამობანა და აშრობა','არასოდეს შეურიო ორი საშუალება და ჩაწერე, რა გამოიყენე'],
  ['Identify the surface: stone, tile, wood or metal? If unsure, do a photo check first','Read the label: acid, chlorine, ammonia or abrasive (see below)','Test on an inconspicuous spot and wait 2-3 minutes','Less is better: always diluted, then rinse and dry','Never mix two products, and write down what you used'],
  ['Определите поверхность: камень, плитка, дерево или металл? Если сомневаетесь, сначала фотопроверка','Прочитайте этикетку: кислота, хлор, аммиак или абразив (см. ниже)','Попробуйте на незаметном участке и подождите 2-3 минуты','Меньше лучше: всегда в разведении, в конце смыть и высушить','Никогда не смешивайте два средства и записывайте, что использовали']],
'hh.pick':['აირჩიე სიტუაცია','Choose a situation','Выберите ситуацию'],
'hh.usual':['ჩვეულებრივ გამოიყენება','Normally used','Обычно используется'],
'hh.sub':['სახლის შემცვლელი','Household substitute','Бытовая замена'],
'hh.where':['სად შეიძლება','Where it is allowed','Где можно'],
'hh.no':['აქ არასოდეს','Never here','Здесь никогда'],
'hh.how':['როგორ გამოვიყენო','How to use','Как использовать'],
'hh.risk':['რისკი','Risk','Риск'],
'hh.labelT':['როგორ წავიკითხო ეტიკეტი','How to read a label','Как читать этикетку'],
'hh.onLabel':['ეტიკეტზე','On the label','На этикетке'],
'hh.notOn':['არ შეიძლება','Not on','Нельзя'],
'hh.casesT':['სახლის ქიმიის გამოყენების შემთხვევები','Cases of using household chemicals','Случаи использования бытовой химии'],
'hh.okBadge':['სწორად გამოიყენეს','Used correctly','Использовали правильно'],
'hh.badBadge':['შეცდომა','Mistake','Ошибка'],
'hh.what':['რა მოხდა','What happened','Что произошло'],
'hh.lesson':['გაკვეთილი','Lesson','Урок'],
'hh.photoFirst':['ჯერ ფოტო-შემოწმება','Photo check first','Сначала фотопроверка'],

/* mechanical */
'mech.big':['სწორი ინსტრუმენტი სწორ ზედაპირზე','The right tool on the right surface','Правильный инструмент для правильной поверхности'],
'mech.lead':['არასწორი ღრუბელი ან პადი ზედაპირს ისევე აზიანებს, როგორც არასწორი ქიმია.','The wrong sponge or pad damages a surface just like the wrong chemical does.','Неправильная губка или пад повреждают поверхность так же, как неправильная химия.'],
'mech.colorsT':['ნაჭრების ფერადი კოდი','Cloth color code','Цветовой код салфеток'],
'mech.c.blue':['ლურჯი','Blue','Синий'],
'mech.c.blueD':['მაგიდა, სარკე, ავეჯი, ზოგადი ზედაპირები','Tables, mirrors, furniture, general surfaces','Столы, зеркала, мебель, общие поверхности'],
'mech.c.red':['წითელი','Red','Красный'],
'mech.c.redD':['მხოლოდ უნიტაზი და პისუარი','Toilets and urinals only','Только унитаз и писсуар'],
'mech.c.yellow':['ყვითელი','Yellow','Жёлтый'],
'mech.c.yellowD':['ნიჟარა, შხაპი, აბაზანის ფილა','Sink, shower, bathroom tiles','Раковина, душ, плитка в ванной'],
'mech.c.green':['მწვანე','Green','Зелёный'],
'mech.c.greenD':['სამზარეულო, მინიბარი, საკვების ზონა','Kitchen, minibar, food areas','Кухня, мини-бар, зона питания'],
'mech.redNote':['წითელი ნაჭერი სხვა ზონაში არასოდეს გამოიყენება - ეს ინფექციის გადატანის მთავარი მიზეზია.','A red cloth is never used in another zone: this is the main cause of spreading infection.','Красная салфетка никогда не используется в другой зоне: это главная причина переноса инфекции.'],
'mech.padsT':['სახეხი ღრუბლის სიმკვრივე','Scrub pad hardness','Жёсткость абразивной губки'],
'mech.pads':[['თეთრი რბილი','წითელი მსუბუქი','ლურჯი საშუალო','მწვანე ძლიერი','შავი სპეციალისტი'],['White soft','Red light','Blue medium','Green strong','Black specialist'],['Белый мягкий','Красный лёгкий','Синий средний','Зелёный сильный','Чёрный для специалиста']],
'mech.padsNote':['გაპრიალებულ ქვაზე მხოლოდ თეთრი. რაც უფრო მუქია პადი, მით უფრო ხეხავს.','Only white on polished stone. The darker the pad, the more it scratches.','На полированном камне только белый. Чем темнее пад, тем сильнее он царапает.'],
'mech.tool':['ინსტრუმენტი','Tool','Инструмент'],
'mech.tech':['ტექნიკა','Technique','Техника'],
'mech.ex':['მაგალითი','Example','Пример'],
'mech.trolleyT':['რა უნდა გქონდეს ტროლეზე (ურიკაზე)','What to have on your trolley (cart)','Что должно быть на тележке'],
'mech.trolleyD':['მონიშნე, რაც უკვე გაქვს. დანარჩენს მენეჯერს ერთი ღილაკით მოსთხოვ.','Tick what you already have. Request the rest from your manager with one tap.','Отметьте, что у вас уже есть. Остальное запросите у менеджера одной кнопкой.'],
'mech.missing':['გაკლია','Missing','Не хватает'],
'mech.items':['ნივთი','items','предметов'],
'mech.reqBtn':['მენეჯერისთვის მოთხოვნა','Request from manager','Запрос менеджеру'],
'mech.buyT':['სად შევიძინო?','Where to buy?','Где купить?'],
'mech.buyD':['Innboard.ai გირჩევს შემოწმებულ მომწოდებლებს, რომლებიც სამეწარმეო ქიმიას და ინსტრუმენტებს უსაფრთხოების ფურცლით აწვდიან.','Innboard.ai recommends trusted suppliers who deliver professional chemicals and tools with a safety data sheet.','Innboard.ai рекомендует проверенных поставщиков, которые поставляют профессиональную химию и инструменты с паспортом безопасности.'],
'mech.supplier':['[მომწოდებლის სახელი] · [მისამართი / ტელეფონი]','[Supplier name] · [address / phone]','[Название поставщика] · [адрес / телефон]'],

/* standards */
'std.dep':['სტუმარი გავიდა','Guest checked out','Гость выехал'],
'std.stay':['სტუმარი რჩება','Guest is staying','Гость остаётся'],
'std.order':['AI რჩევის რიგი','AI advice order','Порядок советов AI'],
'std.o1':['1 · მენეჯერი','1 · Manager','1 · Менеджер'],
'std.o2':['2 · ობიექტი + ექსპერტი','2 · Property + expert','2 · Объект + эксперт'],
'std.o3':['3 · მსოფლიო სტანდარტი','3 · World standard','3 · Мировой стандарт'],
'std.full':['სრული დალაგება','Full cleaning','Полная уборка'],
'std.quick':['სწრაფი დალაგება','Quick cleaning','Быстрая уборка'],
'std.step':['ნაბიჯი','Step','Шаг'],
'std.next':['შესრულდა · შემდეგი','Done · next','Готово · далее'],
'std.seq':['თანმიმდევრობა','Sequence','Последовательность'],
'std.done':['დალაგება დასრულდა ✓','Cleaning complete ✓','Уборка завершена ✓'],

/* recommendations */
'recs.today':['დღევანდელი პრიორიტეტები','Today\'s priorities','Приоритеты на сегодня'],
'recs.doneLbl':['შესრულდა','done','выполнено'],
'recs.room':['ოთახი','Room','Номер'],
'recs.t1':['ღვინის ლაქა მარმარილოს მაგიდაზე. მჟავა არ გამოიყენო.','Wine stain on a marble table. Do not use acid.','Пятно от вина на мраморном столе. Кислоту не использовать.'],
'recs.t1m':['მარმარილო · ორგანული ლაქა','Marble · organic stain','Мрамор · органическое пятно'],
'recs.t2':['VIP სტუმარი 14:00-ზე. ცოცხალი ყვავილები და მისასალმებელი ბარათი.','VIP guest at 14:00. Fresh flowers and a welcome card.','VIP-гость в 14:00. Живые цветы и приветственная открытка.'],
'recs.t2m':['სტანდარტი · VIP','Standard · VIP','Стандарт · VIP'],
'recs.t3':['შხაპის ფილაზე კირის ნადები.','Limescale on the shower tiles.','Известковый налёт на плитке в душе.'],
'recs.t3m':['ბაზალტის ფილა · კირი','Basalt tile · limescale','Базальтовая плитка · налёт'],
'recs.photo':['ფოტო-შემოწმება','Photo check','Фотопроверка'],
'recs.did':['შევასრულე','Done','Выполнено'],
'recs.fixed':['მუდმივი რეკომენდაციები','Standing recommendations','Постоянные рекомендации'],
'recs.f1t':['ლობი · მარმარილო','Lobby · marble','Лобби · мрамор'],
'recs.f1':['ლობის იატაკზე მხოლოდ ნეიტრალური ქვის საწმენდი, დილით 8-მდე.','Only neutral stone cleaner on the lobby floor, before 8 in the morning.','На полу в лобби только нейтральное средство для камня, до 8 утра.'],
'recs.f2t':['აბაზანა · ბაზალტის ფილა','Bathroom · basalt tile','Ванная · базальтовая плитка'],
'recs.f2':['კირის ნადები - ფილის მჟავა საწმენდით, მაგრამ ნაკერები წინასწარ დაასველე.','Limescale: use acidic tile cleaner, but wet the grout first.','Известковый налёт: кислотным средством для плитки, но швы заранее смочите.'],
'recs.note':['ეს რჩევები AI-სთვის პირველი პრიორიტეტია: ასისტენტი ჯერ მენეჯერის სიტყვას ითვალისწინებს.','These tips are the top priority for the AI: the assistant listens to the manager first.','Эти советы для AI в приоритете: ассистент в первую очередь учитывает слово менеджера.'],
'recs.askT':['კითხვა მენეჯერს','Ask the manager','Вопрос менеджеру'],
'recs.hello':['დილა მშვიდობისა! დღეს 12 გასვლაა. 204 პირველ რიგში, შემდეგ 305.','Good morning! 12 check-outs today. 204 first, then 305.','Доброе утро! Сегодня 12 выездов. Сначала 204, потом 305.'],
'recs.mgrName':['[მენეჯერის სახელი]','[Manager name]','[Имя менеджера]'],
'recs.q1':['როგორ გავწმინდო ბაზალტი?','How do I clean basalt?','Как чистить базальт?'],
'recs.q2':['ქიმია გამითავდა','I ran out of chemicals','У меня закончилась химия'],
'recs.q3':['ზედაპირი დაზიანებულია','The surface is damaged','Поверхность повреждена'],
'chat.ph':['დაწერე კითხვა...','Type a question...','Напишите вопрос...'],
'chat.send':['გაგზავნა','Send','Отправить'],
'chat.mgrReply':['შეტყობინება მენეჯერს გაეგზავნა. პასუხი აქ გამოჩნდება.','Message sent to the manager. The reply will appear here.','Сообщение отправлено менеджеру. Ответ появится здесь.'],
'chat.thinking':['ფიქრობს…','Thinking…','Думает…'],
'chat.photo':['ფოტო','Photo','Фото'],
'chat.fallback':['ამ კითხვაზე ზუსტი პასუხი ჯერ არ მაქვს. დააზუსტე ზედაპირი და ლაქა (მაგ. კირი, მარმარილო, ღვინო, ხე, ფოლადი, ქლორი) ან ჰკითხე მენეჯერს.','I do not have an exact answer to this yet. Name the surface and the stain (e.g. limescale, marble, wine, wood, steel, chlorine) or ask your manager.','Точного ответа на этот вопрос пока нет. Уточните поверхность и пятно (напр. налёт, мрамор, вино, дерево, сталь, хлор) или спросите менеджера.'],

/* sanitary */
'san.big':['მოკლედ და მთავარი','Short and essential','Кратко и главное'],
'san.lead':['შეეხე თემას და ნახე ნორმები. თითო თემა - ერთ წუთში.','Tap a topic to see the rules. Each topic takes a minute.','Нажмите на тему, чтобы увидеть нормы. Каждая тема за минуту.'],
'san.mixT':['არასოდეს შეურიო','Never mix','Никогда не смешивайте'],
'san.m1':['ქლორი + მჟავა','Chlorine + acid','Хлор + кислота'],
'san.m1r':['→ ქლორის აირი','→ chlorine gas','→ хлорный газ'],
'san.m2':['ქლორი + ამიაკი','Chlorine + ammonia','Хлор + аммиак'],
'san.m2r':['→ მომწამვლელი აირი','→ toxic gas','→ ядовитый газ'],
'san.m3':['ორი საწმენდი ერთ ვედროში','Two cleaners in one bucket','Два средства в одном ведре'],
'san.m3r':['→ არასოდეს','→ never','→ никогда'],
'san.warn':['თუ თავბრუსხვევა ან სუნთქვის გაძნელება იგრძენი - გადი ოთახიდან, გააღე ფანჯარა და მაშინვე აცნობე მენეჯერს.','If you feel dizzy or have trouble breathing, leave the room, open the window and tell your manager right away.','Если почувствуете головокружение или затруднённое дыхание, выйдите из комнаты, откройте окно и сразу сообщите менеджеру.'],
'san.remember':['გახსოვდეს','Remember','Помните'],
'san.toStd':['დალაგების სტანდარტებზე გადასვლა','Go to cleaning standards','Перейти к стандартам уборки'],

/* experience */
'exp.big':['ისწავლე სხვის შეცდომაზე','Learn from others\' mistakes','Учитесь на чужих ошибках'],
'exp.lead':['რეალური შემთხვევები რეგიონული სასტუმროებიდან: რა მოხდა, როგორ გამოასწორეს და რა გაკვეთილი დარჩა.','Real cases from regional hotels: what happened, how it was fixed and what lesson remained.','Реальные случаи из региональных отелей: что произошло, как исправили и какой урок извлекли.'],
'exp.all':['ყველა','All','Все'],
'exp.stone':['ქვა','Stone','Камень'],
'exp.wood':['ავეჯი','Furniture','Мебель'],
'exp.metal':['ლითონი','Metal','Металл'],
'exp.fix':['გამოსავალი','Solution','Решение'],
'exp.useful':['სასარგებლოა','Useful','Полезно'],

/* restore */
'rs.big':['ზიანი მოხდა? შეაჩერე და შეამცირე','Damage done? Stop it and limit it','Произошло повреждение? Остановите и уменьшите ущерб'],
'rs.lead':['სწორი პირველი ნაბიჯი და ექსპერტის დროული რჩევა ზარალს მინიმუმამდე ამცირებს.','The right first step and timely expert advice keep losses to a minimum.','Правильный первый шаг и своевременный совет эксперта сводят ущерб к минимуму.'],
'rs.what':['რა დაზიანებაა?','What kind of damage?','Какое повреждение?'],
'rs.why':['რატომ მოხდა','Why it happened','Почему это произошло'],
'rs.first':['პირველი ნაბიჯები (დიასახლისი)','First steps (housekeeper)','Первые шаги (горничная)'],
'rs.expRec':['ექსპერტის რეკომენდაცია','Expert recommendation','Рекомендация эксперта'],
'rs.expName':['[ტექნიკური წმენდის ექსპერტი]','[Technical cleaning expert]','[Эксперт по технической чистке]'],
'rs.prod':['რეკომენდებული საშუალება','Recommended product','Рекомендуемое средство'],
'rs.consult':['ექსპერტის კონსულტაციის მოთხოვნა','Request an expert consultation','Запросить консультацию эксперта'],
'rs.consultSent':['კონსულტაციის მოთხოვნა გაიგზავნა','Consultation request sent','Запрос на консультацию отправлен'],
'rs.attach':['მოთხოვნას ავტომატურად დაერთვის ფოტო-შემოწმების შედეგი და ეცნობება მენეჯერს.','The photo check result is attached to the request automatically and the manager is notified.','К запросу автоматически прикрепляется результат фотопроверки, и менеджер получает уведомление.'],
'rs.photoBtn':['დაზიანების ფოტო-შემოწმება','Photo check of the damage','Фотопроверка повреждения'],

/* AI assistant */
'ai.chatTab':['კითხვა და ფოტო','Question and photo','Вопрос и фото'],
'ai.trainTab':['ვარჯიში','Practice','Тренировка'],
'ai.greet':['გამარჯობა! დაწერე კითხვა ან ატვირთე ფოტო (ლაქა, ზედაპირი, საშუალების ეტიკეტი) - გეტყვი, რით და როგორ გაწმინდო.','Hello! Type a question or upload a photo (stain, surface, product label) and I will tell you what to clean it with and how.','Здравствуйте! Напишите вопрос или загрузите фото (пятно, поверхность, этикетка средства), и я подскажу, чем и как очистить.'],
'ai.q1':['რით მოვაშორო კირი გრანიტს?','How do I remove limescale from granite?','Чем убрать налёт с гранита?'],
'ai.q2':['ღვინის ლაქა მარმარილოზე','Wine stain on marble','Пятно от вина на мраморе'],
'ai.q3':['შეიძლება ქლორი ფოლადზე?','Can I use chlorine on steel?','Можно ли хлор на сталь?'],
'ai.attached':['ფოტო მიმაგრებულია','Photo attached','Фото прикреплено'],
'ai.attach':['ფოტოს ატვირთვა','Upload photo','Загрузить фото'],
'ai.clear':['ფოტოს მოხსნა','Remove photo','Убрать фото'],
'ai.photoQ':['რას ხედავ ამ ფოტოზე და როგორ გავწმინდო?','What do you see in this photo and how should I clean it?','Что вы видите на этом фото и как это очистить?'],
'ai.photoHint':['ფოტო მიმაგრებულია. ზუსტი შედეგისთვის გახსენი ფოტო-შემოწმება: აირჩიე ზედაპირი და საშუალება და მიიღებ პასუხს.','Photo attached. For an exact result open the photo check: choose the surface and the product and you will get an answer.','Фото прикреплено. Для точного результата откройте фотопроверку: выберите поверхность и средство и получите ответ.'],
'ai.recT':['ასისტენტის რეკომენდაცია ვარჯიშისთვის','Assistant\'s practice recommendation','Рекомендация ассистента для тренировки'],
'ai.recD':['უპასუხე სავარჯიშოებს - შეცდომების მიხედვით გეტყვი, რომელი თემა გაიმეორო.','Answer the exercises and I will tell you which topic to review based on your mistakes.','Ответьте на упражнения, и по ошибкам я подскажу, какую тему повторить.'],
'ai.score':['შედეგი','Score','Результат'],
'ai.gen':['ახალი სავარჯიშო AI-სგან','New exercise from AI','Новое упражнение от AI'],
'ai.genToast':['დაემატა ახალი სავარჯიშო','A new exercise was added','Добавлено новое упражнение'],
'ai.ex':['სავარჯიშო','Exercise','Упражнение'],
'ai.expl':['ახსნა','Explanation','Объяснение'],
'ai.allRight':['ყოჩაღ! ყველა პასუხი სწორია. გირჩევ სცადო ახალი სავარჯიშო AI-სგან ან გაიმეორო','Well done! All answers are correct. Try a new exercise from AI or review','Отлично! Все ответы верны. Попробуйте новое упражнение от AI или повторите'],
'ai.review':['შეცდომების მიხედვით გირჩევ გაიმეორო:','Based on your mistakes, review:','По вашим ошибкам советую повторить:'],
'ai.thenNew':['შემდეგ სცადე ახალი სავარჯიშო.','Then try a new exercise.','Затем попробуйте новое упражнение.'],

/* profile */
'pf.name':['[სახელი გვარი]','[Full name]','[Имя Фамилия]'],
'pf.role':['დიასახლისი · [სასტუმროს სახელი]','Housekeeper · [Hotel name]','Горничная · [Название отеля]'],
'pf.s1':['ფოტო-შემოწმება','photo checks','фотопроверок'],
'pf.s2':['შეცდომა აიცილე','mistakes avoided','ошибки предотвращены'],
'pf.s3':['სტანდარტის შესრულება','standard compliance','выполнение стандарта'],
'pf.role2':['როლის შეცვლა','Change role','Сменить роль'],
'pf.out':['გასვლა','Sign out','Выйти'],
'pf.langT':['ენა და თემა','Language and theme','Язык и тема'],
'pf.dark':['მუქი','Dark','Тёмная'],
'pf.light':['ნათელი','Light','Светлая'],

/* schedule (housekeeper) */
'sc.big':['რა მელოდება წინ','What is ahead','Что меня ждёт'],
'sc.lead':['ლია მ. · შენი ცვლები, დატვირთვა და გეგმიური სამუშაოები 14 დღით ადრე.','Lia M. · your shifts, workload and planned work 14 days ahead.','Лия М. · ваши смены, нагрузка и плановые работы на 14 дней вперёд.'],
'sc.shifts7':['ცვლა 7 დღეში','shifts in 7 days','смен за 7 дней'],
'sc.off':['დასვენება','Day off','Выходной'],
'sc.planned':['გეგმიური სამუშაო','planned work','плановые работы'],
'sc.busiest':['ყველაზე დატვირთული ცვლა:','Busiest shift:','Самая загруженная смена:'],
'sc.shift':['ცვლა','shift','смена'],
'sc.offShort':['დასვ.','off','вых.'],
'sc.noShift':['ამ დღეს ცვლა არ გაქვს. სასტუმროს დატვირთვა:','You have no shift this day. Hotel workload:','В этот день у вас нет смены. Загрузка отеля:'],
'sc.onShift':['ცვლაზე:','On shift:','На смене:'],
'sc.swap':['ცვლის აღება / გაცვლის მოთხოვნა','Take / swap shift request','Запрос взять / поменять смену'],
'sc.shiftLine':['ცვლა 08:00-16:30 · გუნდი:','Shift 08:00-16:30 · team:','Смена 08:00-16:30 · команда:'],
'sc.dep':['გასვლა','check-outs','выезды'],
'sc.stay':['რჩება','stay-overs','остаются'],
'sc.arr':['ჩამოსვლა','arrivals','заезды'],
'sc.est':['სავარაუდო დრო','estimated time','ориентировочно'],
'sc.depRooms':['გასვლის ოთახები','Check-out rooms','Номера с выездом'],
'sc.stayRooms':['ოთახები, სადაც სტუმარი რჩება','Rooms where the guest stays','Номера, где гость остаётся'],
'sc.busyT':['დატვირთული დღეა','A busy day','Загруженный день'],
'sc.busy':['დაიწყე გასვლის ოთახებით - ახალი სტუმრები 14:00-დან შემოდიან. გეგმიური სამუშაო ამ დღეს არ არის.','Start with check-out rooms: new guests arrive from 14:00. No planned work this day.','Начните с номеров с выездом: новые гости заезжают с 14:00. Плановых работ в этот день нет.'],
'sc.planT':['გეგმიური სამუშაო','Planned work','Плановые работы'],
'sc.planD':['ნაკლები დატვირთვის გამო დარჩენილ დროს მენეჯერმა ეს სამუშაო დაგეგმა:','Because of the lighter load, the manager planned this work for the spare time:','Из-за меньшей нагрузки менеджер запланировал на свободное время эту работу:'],
'sc.instr':['ინსტრუქცია','Instructions','Инструкция'],
'sc.lowAsk':['დაბალი დატვირთვის დღეა. თუ დრო დაგრჩა, ჰკითხე მენეჯერს გეგმიური სამუშაოს შესახებ.','A low workload day. If you have time left, ask your manager about planned work.','День с низкой нагрузкой. Если останется время, спросите менеджера о плановых работах.'],
'sc.howT':['როგორ ითვლება დატვირთვა','How workload is calculated','Как считается нагрузка'],
'sc.how':['ჯავშნების მიხედვით: გასვლის ოთახი ~31 წთ, დარჩენილი სტუმრის ოთახი ~18 წთ, პლუს საზოგადოებრივი სივრცე. ჯამი იყოფა ცვლაზე მყოფ დიასახლისებზე.','From bookings: a check-out room takes ~31 min, a stay-over room ~18 min, plus public areas. The total is split among the housekeepers on shift.','По бронированиям: номер с выездом ~31 мин, номер с остающимся гостем ~18 мин, плюс общественные зоны. Сумма делится между горничными на смене.'],

/* manager home */
'mg.badge':['მენეჯერი','Manager','Менеджер'],
'mg.hotel':['[სასტუმროს სახელი]','[Hotel name]','[Название отеля]'],
'mg.sub':['დღეს · 4 დიასახლისი ცვლაზე','Today · 4 housekeepers on shift','Сегодня · 4 горничные на смене'],
'mg.st1':['ოთახი მზადაა','rooms ready','номеров готово'],
'mg.st2':['ფოტო-შემოწმება','photo checks','фотопроверок'],
'mg.st3':['შეცდომა თავიდან აცილდა','mistakes prevented','ошибки предотвращены'],
'mg.ctaT':['პრიორიტეტი ან რეკომენდაცია','Priority or recommendation','Приоритет или рекомендация'],
'mg.ctaD':['გაუგზავნე დიასახლისს ან მთელ გუნდს','Send to a housekeeper or the whole team','Отправьте горничной или всей команде'],
'mg.forecast':['დატვირთვის პროგნოზი · 7 დღე','Workload forecast · 7 days','Прогноз нагрузки · 7 дней'],
'mg.lowDays':['დღე - დაბალი დატვირთვა, შესაფერისი გეგმიური სამუშაოსთვის','day(s) with low workload, suitable for planned work','дн. с низкой нагрузкой, подходят для плановых работ'],
'mg.photoNew':['ფოტო-შემოწმება · ახალი','Photo checks · new','Фотопроверки · новые'],
'mg.pcWho':['ლია მ. · ოთახი 204','Lia M. · Room 204','Лия М. · Номер 204'],
'mg.pcWhat':['მარმარილო · ღვინის ლაქა','Marble · wine stain','Мрамор · пятно от вина'],
'mg.pcTxt':['AI: მჟავა აკრძალულია. დიასახლისმა შეამოწმა „სახლის სპრეი“ - სისტემამ არ დაუშვა და ნეიტრალური საწმენდი ურჩია.','AI: acid is not allowed. The housekeeper checked a "household spray", the system rejected it and suggested a neutral cleaner.','AI: кислота запрещена. Горничная проверила «бытовой спрей», система его не допустила и посоветовала нейтральное средство.'],
'mg.confirm':['რჩევის დადასტურება','Confirm advice','Подтвердить совет'],
'mg.confirmed':['რჩევა დადასტურდა','Advice confirmed','Совет подтверждён'],
'mg.goRoom':['ოთახში მივალ','I will go to the room','Иду в номер'],
'mg.goRoomT':['ლია მ.-ს ეცნობა, რომ მიდიხარ','Lia M. has been told you are coming','Лия М. получила уведомление, что вы идёте'],
'mg.qT':['კითხვები გუნდიდან','Questions from the team','Вопросы от команды'],
'mg.qOpen':['2 ღია','2 open','2 открыто'],
'mg.q1who':['ნინო ბ. · ოთახი 112','Nino B. · Room 112','Нино Б. · Номер 112'],
'mg.q1':['შხაპის ბაზალტის ფილაზე კირის ნადებია. სახლის კირის საწმენდი შეიძლება?','There is limescale on the basalt shower tiles. Can I use a household limescale remover?','На базальтовой плитке в душе известковый налёт. Можно бытовое средство от налёта?'],
'mg.q1a':['სახლის საწმენდი არა - უცნობი შემადგენლობაა. გამოიყენე ფილის მჟავა საწმენდი სწორი განზავებით, ნაკერები ჯერ წყლით დაასველე და ბოლოს უხვად ჩამორეცხე.','No household cleaner: the composition is unknown. Use an acidic tile cleaner at the right dilution, wet the grout with water first and rinse well at the end.','Бытовое нельзя: состав неизвестен. Используйте кислотное средство для плитки в правильном разведении, сначала смочите швы водой, в конце обильно смойте.'],
'mg.q2who':['თამარ კ. · ლობი','Tamar K. · Lobby','Тамар К. · Лобби'],
'mg.q2':['ლობის ხის მაგიდაზე ჭიქის თეთრი კვალია. რით მოვაშორო?','There is a white glass ring on the wooden lobby table. How do I remove it?','На деревянном столе в лобби белый след от стакана. Чем убрать?'],
'mg.q2a':['ეს ლაქის ზედაპირული ტენია. გაამშრალე რბილი ნაჭრით, წყალი და უნივერსალური სპრეი არ გამოიყენო. თუ არ გაქრა - ფოტო გადაუღე და ექსპერტს ვკითხავთ.','This is surface moisture in the varnish. Dry it with a soft cloth, do not use water or all-purpose spray. If it stays, take a photo and we will ask the expert.','Это поверхностная влага в лаке. Просушите мягкой салфеткой, не используйте воду и универсальный спрей. Если не исчезнет, сфотографируйте, и мы спросим эксперта.'],
'mg.aiSuggest':['AI-ს შემოთავაზებული პასუხი','AI suggested reply','Ответ, предложенный AI'],
'mg.replyPh':['დაწერე პასუხი...','Write a reply...','Напишите ответ...'],
'mg.reply':['პასუხის გაგზავნა','Send reply','Отправить ответ'],
'mg.replyNeed':['ჯერ დაწერე პასუხი','Write a reply first','Сначала напишите ответ'],
'mg.replySent':['პასუხი გაიგზავნა','Reply sent','Ответ отправлен'],
'mg.sentMark':['გაიგზავნა ✓','Sent ✓','Отправлено ✓'],
'mg.teamT':['გუნდი ახლა','Team right now','Команда сейчас'],
'mg.m1':['ოთახი 112 · კითხვა გამოგზავნა','Room 112 · sent a question','Номер 112 · отправила вопрос'],
'mg.m2':['ოთახი 204 · ფოტო-შემოწმება','Room 204 · photo check','Номер 204 · фотопроверка'],
'mg.m3':['ლობი · საზოგადოებრივი სივრცე','Lobby · public area','Лобби · общественная зона'],
'mg.m4':['ოთახი 305 · VIP მომზადება','Room 305 · VIP preparation','Номер 305 · подготовка VIP'],

/* manager send */
'ms.prio':['პრიორიტეტი ოთახზე','Room priority','Приоритет по номеру'],
'ms.gen':['ზოგადი რეკომენდაცია','General recommendation','Общая рекомендация'],
'ms.room':['ოთახი','Room','Номер'],
'ms.lobby':['ლობი','Lobby','Лобби'],
'ms.surf':['ზედაპირი / დაბინძურება','Surface / stain','Поверхность / загрязнение'],
'ms.surfs':[['მარმარილო','გრანიტი','ბაზალტი','ხის ავეჯი','ფილა','ხალიჩა'],['Marble','Granite','Basalt','Wooden furniture','Tile','Carpet'],['Мрамор','Гранит','Базальт','Деревянная мебель','Плитка','Ковёр']],
'ms.prioLbl':['პრიორიტეტი','Priority','Приоритет'],
'ms.to':['ვის','To','Кому'],
'ms.team':['მთელი გუნდი','Whole team','Вся команда'],
'ms.note':['შენიშვნა','Note','Примечание'],
'ms.notePh':['მაგ. ღვინის ლაქა მაგიდაზე, მჟავა არ გამოიყენო','e.g. wine stain on the table, do not use acid','напр. пятно от вина на столе, кислоту не использовать'],
'ms.aiT':['AI ასისტენტი ამას პირველ რიგში გაითვალისწინებს','The AI assistant will take this into account first','AI-ассистент учтёт это в первую очередь'],
'ms.aiD':['მენეჯერის რჩევა → ექსპერტი → მსოფლიო სტანდარტი','Manager advice → expert → world standard','Совет менеджера → эксперт → мировой стандарт'],
'ms.on':['ჩართვა','Turn on','Включить'],
'msend.send':['გაგზავნა','Send','Отправить'],
'ms.sent':['გაიგზავნა','Sent','Отправлено'],

/* manager schedule */
'mc.big':['დატვირთვა 14 დღით ადრე','Workload 14 days ahead','Нагрузка на 14 дней вперёд'],
'mc.lead':['პროგნოზი ჯავშნების მიხედვით. ნაკლები დატვირთვის დღეებში დაგეგმე ღრმა წმენდა და მოვლა.','Forecast based on bookings. Plan deep cleaning and maintenance on lighter days.','Прогноз по бронированиям. В дни с меньшей нагрузкой планируйте генеральную уборку и уход.'],
'mc.tap':['შეეხე სვეტს დღის დეტალებისთვის','Tap a bar for the day\'s details','Нажмите на столбец, чтобы увидеть детали дня'],
'mc.need':['საჭიროა','Needed','Нужно'],
'mc.has':['გუნდს აქვს','team has','у команды есть'],
'mc.hk':['დიასახლისი','housekeepers','горничных'],
'mc.highT':['მაღალი დატვირთვა','High workload','Высокая нагрузка'],
'mc.high':['გუნდის დრო თითქმის სრულად დაკავებულია. გეგმიური სამუშაო ამ დღეს არ დაგეგმო','The team\'s time is almost fully booked. Do not plan maintenance on this day','Время команды почти полностью занято. Не планируйте плановые работы на этот день'],
'mc.alt':['საუკეთესო ალტერნატივაა','the best alternative is','лучшая альтернатива'],
'mc.extra':['დამატებითი ცვლის მოთხოვნა','Request an extra shift','Запросить дополнительную смену'],
'mc.extraSent':['დამატებითი ცვლის მოთხოვნა გაიგზავნა გუნდში','Extra shift request sent to the team','Запрос на дополнительную смену отправлен команде'],
'mc.free':['თავისუფალი დრო:','Free time:','Свободное время:'],
'mc.lowTxt':['ნაკლები დატვირთვის დღეა - იდეალურია გეგმიური სამუშაოსთვის.','A lighter day, ideal for planned work.','День с меньшей нагрузкой, идеален для плановых работ.'],
'mc.midTxt':['ნორმალური დატვირთვა. შესაძლებელია მცირე გეგმიური სამუშაო.','Normal workload. Small planned tasks are possible.','Обычная нагрузка. Возможны небольшие плановые работы.'],
'mc.sugg':['AI-ს შეთავაზება (ყველაზე ვადაგადაცილებული პირველად)','AI suggestions (most overdue first)','Предложения AI (сначала самые просроченные)'],
'mc.plannedL':['დაგეგმილი სამუშაოები','Planned tasks','Запланированные работы'],
'mc.empty':['ჯერ არაფერია დაგეგმილი','Nothing planned yet','Пока ничего не запланировано'],
'mc.add':['+ დაგეგმვა','+ Plan','+ Запланировать'],
'mc.noTime':['ამ დღეს საკმარისი თავისუფალი დრო აღარ არის','Not enough free time left on this day','В этот день недостаточно свободного времени'],
'mc.addedT':['დაიგეგმა - დიასახლისი ცვლამდე ნახავს','Planned: the housekeeper will see it before the shift','Запланировано: горничная увидит это до смены'],
'mc.teamT':['გუნდის განრიგი · 7 დღე','Team schedule · 7 days','График команды · 7 дней'],
'mc.teamD':['შეეხე უჯრას ცვლის ჩასართავად ან მოსახსნელად - დიასახლისს ეცნობება.','Tap a cell to add or remove a shift: the housekeeper will be notified.','Нажмите на ячейку, чтобы добавить или снять смену: горничная получит уведомление.'],
'mc.shiftOn':['ცვლა დაემატა','Shift added','Смена добавлена'],
'mc.shiftOff':['ცვლა მოიხსნა','Shift removed','Смена снята'],
'mc.baseT':['გეგმიური სამუშაოების ბაზა','Planned work library','База плановых работ'],
'mc.every':['ყოველ','Every','Каждые'],
'mc.days':['დღეში','days','дн.'],
'mc.last':['ბოლოს','last done','последний раз'],
'mc.ago':['დღის წინ','days ago','дн. назад'],
'mc.overdue':['ვადაგადაცილ.','Overdue','Просрочено'],
'mc.ontime':['დროზეა','On time','В срок'],
'mc.sendAll':['განრიგის გაგზავნა გუნდისთვის','Send schedule to the team','Отправить график команде'],
'mc.sentAll':['განრიგი გაეგზავნა გუნდს','Schedule sent to the team','График отправлен команде'],
'mc.lowLbl':['დაბალი <56%','Low <56%','Низкая <56%'],
'mc.highLbl':['მაღალი ≥80%','High ≥80%','Высокая ≥80%'],
/* production additions */
'foot.rights':[null,'All rights reserved','Все права защищены'],
'otp.bad':['შეიყვანე 4-ნიშნა კოდი','Enter the 4-digit code','Введите 4-значный код'],
'login.bad':['შეიყვანე სწორი ნომერი: 9 ციფრი, იწყება 5-ით','Enter a valid number: 9 digits starting with 5','Введите правильный номер: 9 цифр, начиная с 5'],
'otp.resent':['კოდი ხელახლა გაიგზავნა','Code sent again','Код отправлен повторно'],
'photo.pickType':['საშუალების ტიპი','Product type','Тип средства'],
'photo.detected':['სახელით ამოცნობილია','Detected from the name','Определено по названию'],
'photo.needSurf':['ჯერ აირჩიე ზედაპირი','Choose a surface first','Сначала выберите поверхность'],
'photo.needType':['აირჩიე საშუალების ტიპი ან დაწერე სახელი','Choose the product type or type its name','Выберите тип средства или впишите название'],
'photo.optional':['ფოტო არჩევითია: ის შედეგს დაერთვება მენეჯერისთვის.','Photos are optional: they are attached to the result for your manager.','Фото по желанию: они прикрепляются к результату для менеджера.'],
'photo.again':['ახალი შემოწმება','New check','Новая проверка'],
'pt.acid':['მჟავა','Acid','Кислота'],
'pt.chlorine':['ქლორი','Chlorine','Хлор'],
'pt.ammonia':['ამიაკი','Ammonia','Аммиак'],
'pt.abrasive':['აბრაზივი','Abrasive','Абразив'],
'pt.alkaline':['ტუტე','Alkaline','Щёлочь'],
'pt.alcohol':['სპირტი','Alcohol','Спирт'],
'pt.neutral':['ნეიტრალური','Neutral','Нейтральное'],
'pt.unknown':['არ ვიცი','Not sure','Не знаю'],
'why.acid':['მჟავა კირს და კალციტურ ქვას ხსნის, ნაკერებს და დამცავ ფენას აზიანებს.','Acid dissolves limescale and calcite stone, and damages grout and protective layers.','Кислота растворяет налёт и кальцитовый камень, повреждает швы и защитный слой.'],
'why.chlorine':['ქლორი ფოლადზე ჟანგს ტოვებს, ქვის და ქსოვილის ფერს აზიანებს, მჟავასთან ან ამიაკთან კი ტოქსიკურ აირს გამოყოფს.','Chlorine leaves rust on steel, damages the color of stone and fabric, and releases toxic gas with acid or ammonia.','Хлор оставляет ржавчину на стали, портит цвет камня и ткани, а с кислотой или аммиаком выделяет ядовитый газ.'],
'why.ammonia':['ამიაკი ხის ლაქს აზიანებს, ქლორთან შერევისას კი მომწამვლელ აირს გამოყოფს.','Ammonia damages wood varnish and releases toxic gas when mixed with chlorine.','Аммиак портит лак на дереве, а при смешивании с хлором выделяет ядовитый газ.'],
'why.abrasive':['აბრაზივი ზედაპირს ხეხავს: გაპრიალებული ქვა, მინა, ფოლადი და ლაქიანი ხე ბზინვას კარგავს.','Abrasives scratch: polished stone, glass, steel and varnished wood lose their shine.','Абразив царапает: полированный камень, стекло, сталь и лакированное дерево теряют блеск.'],
'why.alkaline':['ძლიერი ტუტე ცხიმს კარგად აშორებს, მაგრამ ქვის დამცავ ფენას ცვეთს და ხის ლაქს აზიანებს.','A strong alkali removes grease well, but wears the protective layer of stone and damages wood varnish.','Сильная щёлочь хорошо удаляет жир, но стирает защитный слой камня и портит лак на дереве.'],
'why.alcohol':['სპირტი სწრაფად შრება და ზოლებს არ ტოვებს, მაგრამ ლაქს და ფირს შეიძლება დააზიანოს.','Alcohol dries fast without streaks, but can damage varnish and film coatings.','Спирт быстро сохнет без разводов, но может повредить лак и плёнку.'],
'why.neutral':['ნეიტრალური საწმენდი ყველაზე უსაფრთხოა და ჩვეულებრივ ყველგან შეიძლება.','A neutral cleaner is the safest choice and is usually fine everywhere.','Нейтральное средство самое безопасное и обычно подходит везде.'],
'why.unknown':['საშუალების შემადგენლობა უცნობია. ჯერ ეტიკეტზე მოძებნე: მჟავა, ქლორი, ამიაკი თუ აბრაზივი.','The composition is unknown. First look on the label for acid, chlorine, ammonia or abrasive.','Состав неизвестен. Сначала найдите на этикетке: кислота, хлор, аммиак или абразив.'],
'why.test':['გამოყენებამდე სცადე შეუმჩნეველ ადგილზე და დაიცავი ეტიკეტზე მითითებული განზავება.','Before use, test on a hidden spot and follow the dilution on the label.','Перед применением попробуйте на незаметном участке и соблюдайте разведение по этикетке.'],
'ex.label':['მაგალითი','example','пример'],
'contact.sending':['იგზავნება…','Sending…','Отправка…'],
'contact.fail':['გაგზავნა ვერ მოხერხდა. სცადე ხელახლა.','Could not send. Please try again.','Не удалось отправить. Попробуйте ещё раз.'],
'contact.okT':['მადლობა!','Thank you!','Спасибо!'],
'contact.again':['კიდევ ერთი შეტყობინება','Send another message','Отправить ещё одно сообщение'],
'pwa.install':[null,'Install app','Установить приложение'],
'pwa.done':['აპი დაყენებულია','App installed','Приложение установлено'],
'pwa.ios':['iPhone-ზე: დააჭირე „გაზიარებას“ და აირჩიე „Add to Home Screen“','On iPhone: tap Share, then Add to Home Screen','На iPhone: нажмите «Поделиться», затем «На экран Домой»'],
'mobile.btn':[null,'Mobile view','Мобильная версия'],
'mobile.close':['მობილური ხედის დახურვა','Close mobile view','Закрыть мобильный вид'],
'a11y.top':['ზემოთ დაბრუნება','Back to top','Наверх'],
'nojs':[null,'Please enable JavaScript to use this website.','Включите JavaScript, чтобы пользоваться сайтом.'],
'video.yt':['YouTube · ვიდეოები ამ თემაზე','YouTube · videos on this topic','YouTube · видео по теме'],
'restored':['ცვლილებები შენახულია ამ მოწყობილობაზე','Changes are saved on this device','Изменения сохранены на этом устройстве']
};

/* Georgian text from index.html (original version) */
const KA_HTML={"a11y.skip":"გადასვლა შინაარსზე","nav.home":"მთავარი","nav.features":"შესაძლებლობები","nav.app":"ასისტენტი","nav.about":"ჩვენ შესახებ","nav.contact":"კონტაქტი","pwa.install":"აპის დაყენება","mobile.btn":"მობილური ვერსია","nav.login":"შესვლა","nav.manager":"მენეჯერის პანელი","welcome.pickLang":"აირჩიე ენა","nojs":"საიტის გამოსაყენებლად ჩართე JavaScript.","welcome.chip3":"AI ასისტენტი","welcome.hero":"სასტუმროს დიასახლისის ჭკვიანი ასისტენტი","welcome.lead":"სწორი ქიმია შესაბამის ზედაპირზე. გადაუღე ფოტო და AI გეტყვის, რა და როგორ გაწმინდო","role.big":"ვინ ხარ სასტუმროში?","role.hk":"დიასახლისი","role.hkD":"ფოტო-შემოწმება, ქიმია, სტანდარტები, მენეჯერის დავალებები","role.mg":"მენეჯერი","role.mgD":"პრიორიტეტები, რეკომენდაციები, კითხვებზე პასუხი","home.seeFeatures":"ნახე შესაძლებლობები","photo.anl":"AI აანალიზებს ფოტოებს…","verdict.no":"არ გამოიყენო","verdict.surface":"ზედაპირი","hero.surface":"მარმარილო (კალციტური ქვა), გაპრიალებული","verdict.instead":"სანაცვლოდ გამოიყენე","hero.instead":"pH-ნეიტრალური ქვის საწმენდი და რბილი მიკროფიბრა; თუ არ გაქვს - ნეიტრალური ჭურჭლის სითხის სუსტი ხსნარი.","home.ctaT":"ფოტო-შემოწმება","std.o1":"1 · მენეჯერი","feat.big":"შესაძლებლობები","feat.lead":"ყველაფერი, რაც დიასახლისს და მენეჯერს ცვლის განმავლობაში სჭირდება, ერთ ადგილას.","about.big":"ჭკვიანი ასისტენტი სასტუმროს გუნდისთვის","terms.c1":"Innboard.ai ეხმარება სასტუმროს თანამშრომლებს ზედაპირისთვის სწორი ქიმიისა და ინსტრუმენტის შერჩევაში.","about.missionT":"ჩვენი მიზანი","chem.lead":"არასწორი ქიმია ძვირადღირებულ ზედაპირს შეიძლება სამუდამოდ დააზიანოს. სწორი არჩევანით პრობლემებს ავირიდებთ.","about.missionD":"დიასახლისი ფოტოს უღებს ზედაპირს და საშუალებას, AI კი წამებში ეუბნება, შეიძლება თუ არა მისი გამოყენება. მენეჯერი ხედავს შემოწმებებს, აძლევს პრიორიტეტებს და გეგმავს დატვირთვას.","about.whoT":"ვისთვისაა","about.who1":"დიასახლისისთვის, რომელსაც სწრაფი და ზუსტი პასუხი სჭირდება ოთახშივე","about.who2":"მენეჯერისთვის, რომელიც აკონტროლებს ხარისხს და გუნდის დატვირთვას","about.who3":"სასტუმროსთვის, რომელსაც სურს ძვირადღირებული ზედაპირების დაცვა","about.valuesT":"ჩვენი პრინციპები","std.order":"AI რჩევის რიგი","recs.note":"ეს რჩევები AI-სთვის პირველი პრიორიტეტია: ასისტენტი ჯერ მენეჯერის სიტყვას ითვალისწინებს.","exp.big":"ისწავლე სხვის შეცდომაზე","exp.lead":"რეალური შემთხვევები რეგიონული სასტუმროებიდან: რა მოხდა, როგორ გამოასწორეს და რა გაკვეთილი დარჩა.","mech.big":"სწორი ინსტრუმენტი სწორ ზედაპირზე","mech.lead":"არასწორი ღრუბელი ან პადი ზედაპირს ისევე აზიანებს, როგორც არასწორი ქიმია.","about.ctaT":"გინდა Innboard.ai შენს სასტუმროში?","about.ctaD":"მოგვწერე და გაჩვენებთ, როგორ მუშაობს შენს სასტუმროში.","contact.big":"დაგვიკავშირდი","contact.lead":"გაქვს კითხვა ან გინდა Innboard.ai შენს სასტუმროში? შეავსე ფორმა და მალე გიპასუხებთ.","contact.name":"სახელი","contact.hotel":"სასტუმროს სახელი","login.label":"ტელეფონის ნომერი","contact.email":"ელ-ფოსტა","contact.msg":"შეტყობინება","msend.send":"გაგზავნა","contact.okT":"მადლობა!","contact.sent":"შეტყობინება გაიგზავნა. მალე გიპასუხებთ","contact.again":"კიდევ ერთი შეტყობინება","contact.emailPh":"[ელ-ფოსტა]","contact.addr":"მისამართი","contact.addrPh":"[მისამართი]","contact.hoursT":"სამუშაო საათები","contact.hours":"ორშაბათი - პარასკევი · 10:00-19:00","terms.t":"წესები და პირობები","terms.lead":"ეს გვერდი შაბლონია - ჩაწერე აქ შენი სერვისის პირობები.","terms.h1":"1. სერვისის აღწერა","terms.h2":"2. პერსონალური მონაცემები","terms.c2":"ტელეფონის ნომერი გამოიყენება მხოლოდ შესვლისთვის. ფოტოები ინახება სასტუმროს ანგარიშში.","terms.h3":"3. პასუხისმგებლობა","terms.c3":"AI რჩევა დამხმარეა. საეჭვო შემთხვევაში მიმართე მენეჯერს.","login.big":"შესვლა ტელეფონით","login.lead":"მიუთითე ნომერი და გამოგიგზავნით 4-ნიშნა კოდს SMS-ით","login.info":"შესვლა შეგიძლია იმ ნომრით, რომელიც შენმა მენეჯერმა დაამატა. ნომერი ვერ მოიძებნა? მიმართე მენეჯერს","login.get":"კოდის მიღება","otp.big":"შეიყვანე კოდი","otp.sent":"კოდი გაიგზავნა ნომერზე","otp.change":"შეცვლა","otp.resend":"კოდი არ მოგივიდა? ხელახლა გაგზავნა","otp.confirm":"დადასტურება","role.lead":"[სასტუმროს სახელი] · აირჩიე შენი როლი","role.hint":"როლს მენეჯერი ანიჭებს თანამშრომლის დამატებისას","welcome.agree":"გაგრძელებით ეთანხმები","welcome.terms":"წესებს და პირობებს","nf.t":"გვერდი ვერ მოიძებნა","nf.d":"ბმული შეიძლება შეცვლილია ან წაშლილი.","nf.back":"მთავარზე დაბრუნება","foot.site":"საიტი","foot.rights":"ყველა უფლება დაცულია","a11y.lang":"ენა","a11y.theme":"თემის შეცვლა","a11y.menu":"მენიუ"};
Object.keys(KA_HTML).forEach(k=>{if(S[k]&&S[k][0]==null)S[k][0]=KA_HTML[k]});


/* ---------- 3. Content data ---------- */
/* Georgian content (source text from the design) */
const DATA={ka:{"SURF":[{"k":"marble","n":"მარმარილო","sub":"კალციტური ქვა","l":"hi","lt":"მაღალი მგრძნობელობა","d":"რბილი ქვა და მჟავაზე რეაგირებს. ლიმონის წვეთიც კი მქრქალ ლაქას ტოვებს, რომელიც ჩვეულებრივი წმენდით აღარ სცილდება.","ph":[7,10],"use":["pH-ნეიტრალური ქვის საწმენდი","ქვის ყოველდღიური მოვლის საშუალება","რბილი მიკროფიბრა და თბილი წყალი"],"never":["ძმარი, ლიმონი, ლიმონმჟავა","კირის მოსაშორებელი და WC საშუალებები (მჟავა)","აბრაზიული ფხვნილი და ლითონის ღრუბელი","ქლორიანი საშუალება"],"how":["ჯერ მშრალად მოაშორე მტვერი და ნაწილაკები - ქვიშა ქვას კაწრავს","გაწმინდე განზავებული pH-ნეიტრალური ქვის საწმენდით","ჩამოიბანე სუფთა წყლით და მაშინვე გაამშრალე მიკროფიბრით"]},{"k":"trav","n":"ტრავერტინი","sub":"ფოროვანი კალციტური ქვა","l":"hi","lt":"მაღალი მგრძნობელობა","d":"მარმარილოს მსგავსად მჟავაზე რეაგირებს, ფორებში კი ჭუჭყი და წყალი გროვდება. ჭარბი სითხე ლაქებს ტოვებს.","ph":[7,10],"use":["pH-ნეიტრალური ქვის საწმენდი","რბილი ჯაგრისი ფორებისთვის","კარგად გაწურული მიკროფიბრა"],"never":["ძმარი, ლიმონი და ნებისმიერი მჟავა","კირის მოსაშორებელი საშუალებები","აბრაზიული ფხვნილი","ორთქლით წმენდა შეუვსებელ ფორებზე"],"how":["მოაშორე მტვერი მშრალი მოპით ან მტვერსასრუტით","გაწმინდე განზავებული ნეიტრალური საწმენდით, ფორები - რბილი ჯაგრისით","ჩამოიბანე მცირე წყლით და მაშინვე გაამშრალე"]},{"k":"lime","n":"კირქვა","sub":"დანალექი კალციტური ქვა","l":"hi","lt":"მაღალი მგრძნობელობა","d":"ყველაზე რბილი და შთამნთქმელი ქვაა ამ სიაში. მჟავა მას წამებში აზიანებს, ზეთი და ღვინო კი ღრმად შედის.","ph":[7,10],"use":["pH-ნეიტრალური ქვის საწმენდი","ლაქის სწრაფი აღება ქაღალდის ხელსახოცით","მიკროფიბრა და თბილი წყალი"],"never":["ნებისმიერი მჟავა, მათ შორის „ბუნებრივი“ ძმარი","ქლორიანი და ამიაკიანი საშუალებები","ლითონის ღრუბელი და ფხვნილი"],"how":["ლაქა მაშინვე აიღე - მიადე, არ გაუსვა","გაწმინდე ნეიტრალური ქვის საწმენდით","გაამშრალე და აცნობე მენეჯერს, თუ კვალი დარჩა"]},{"k":"gran","n":"გრანიტი","sub":"სილიკატური ქვა","l":"mid","lt":"საშუალო მგრძნობელობა","d":"მყარი და მჟავისადმი შედარებით მდგრადი ქვაა, მაგრამ მისი დამცავი ფენა (სილერი) მჟავიანი და ძლიერ ტუტე საშუალებებით ცვდება.","ph":[6,10],"use":["pH-ნეიტრალური ქვის საწმენდი ყოველდღიურად","კირის ნადებზე - ქვისთვის დაშვებული სპეციალური საშუალება","მიკროფიბრა"],"never":["ძლიერი მჟავა ან ტუტე ყოველდღიურად","აბრაზიული ფხვნილი გაპრიალებულ ზედაპირზე","ზეთოვანი „ბზინვის“ სპრეები"],"how":["მოაშორე ნაწილაკები მშრალად","გაწმინდე ნეიტრალური საწმენდით","კირის ნადებზე საშუალება ჯერ შეუმჩნეველ ადგილზე სცადე"]},{"k":"bas","n":"ბაზალტი","sub":"ვულკანური ქვა","l":"mid","lt":"საშუალო მგრძნობელობა","d":"მკვრივი ვულკანური ქვაა და მჟავა ფილის საწმენდს უძლებს, თუ ის სწორადაა განზავებული. სუსტი წერტილი ნაკერებია.","ph":[4,11],"use":["ყოველდღიურად - ნეიტრალური საწმენდი","კირის ნადებზე - მჟავა ფილის საწმენდი სწორი განზავებით","ნაკერების წინასწარ დასველება წყლით"],"never":["გაუზავებელი მჟავა","სახლის კირის საწმენდი უცნობი შემადგენლობით","მჟავის დატოვება ზედაპირზე ჩამობანის გარეშე"],"how":["ნაკერები და ზედაპირი დაასველე სუფთა წყლით","წაუსვი განზავებული საწმენდი და დაელოდე ეტიკეტზე მითითებულ დროს","უხვად ჩამოიბანე და გაამშრალე"]},{"k":"cer","n":"კერამიკა / ფაიფური","sub":"მოჭიქული ფილა, ნიჟარა, უნიტაზი","l":"lo","lt":"დაბალი მგრძნობელობა","d":"ქიმიისადმი ყველაზე მდგრადი ზედაპირია. ფრთხილად მოეპყარი ნაკერებს და მოჭიქულ ფენას - აბრაზივი ბზინვას აქრობს.","ph":[2,12],"use":["ცხიმზე - ტუტე საწმენდი","კირზე - მჟავა საწმენდი (ნაკერები წინასწარ დაასველე)","სანიტარიულ ზონაში - დეზინფექციის საშუალება"],"never":["ქლორის და მჟავის ერთად ან ზედიზედ გამოყენება","აბრაზიული ფხვნილი მოჭიქულ ზედაპირზე","ლითონის ღრუბელი"],"how":["წაუსვი საწმენდი ზემოდან ქვემოთ","დაელოდე მოქმედების დროს","ჩამოიბანე და გაამშრალე - წყლის ლაქები არ დატოვო"]},{"k":"steel","n":"უჟანგავი ფოლადი","sub":"ონკანი, მოაჯირი, ტექნიკა","l":"mid","lt":"საშუალო მგრძნობელობა","d":"ქლორი და მარილმჟავა ფოლადის დამცავ ფენას არღვევს და ჟანგის წერტილებს ტოვებს, განსაკუთრებით ზღვისპირა ჰაერში.","ph":[5,10],"use":["ნეიტრალური ან ფოლადის სპეციალური საწმენდი","მიკროფიბრა - ბოჭკოს მიმართულებით","პერიოდულად დამცავი საშუალება"],"never":["ქლორიანი საშუალება","ლითონის ღრუბელი და ფხვნილი","მარილმჟავიანი საწმენდები"],"how":["გაწმინდე ნეიტრალური საწმენდით ბოჭკოს მიმართულებით","ჩამოიბანე სუფთა წყლით","მშრალი მიკროფიბრით გააპრიალე"]},{"k":"wood","n":"ხე / ავეჯი","sub":"ლაქით ან ზეთით დამუშავებული","l":"hi","lt":"მაღალი მგრძნობელობა","d":"ხეს ყველაზე მეტად ჭარბი წყალი და უნივერსალური სპრეი აზიანებს: ლაქი თეთრდება და იბერება.","ph":[7,9],"use":["ხის ნეიტრალური საწმენდი","კარგად გაწურული მიკროფიბრა","პერიოდულად მოვლის ზეთი ან პოლიროლი"],"never":["სველი ნაჭერი და ჭარბი წყალი","ამიაკიანი და უნივერსალური სპრეები","ორთქლი და აბრაზივი"],"how":["მტვერი მოაშორე მშრალი მიკროფიბრით","საწმენდი ნაჭერზე შეასხი და არა ზედაპირზე","მაშინვე გაამშრალე"]},{"k":"glass","n":"მინა / სარკე","sub":"ფანჯარა, სარკე, მინის მაგიდა","l":"lo","lt":"დაბალი მგრძნობელობა","d":"მინა მდგრადია, მაგრამ სარკის კიდეებთან ჩამდინარე სითხე ამალგამას აზიანებს და შავ ლაქებს ტოვებს.","ph":[6,10],"use":["მინის საწმენდი (სპირტზე დაფუძნებული)","მინის მიკროფიბრა","საწმენდი რეზინა დიდ ზედაპირზე"],"never":["აბრაზიული ფხვნილი და მწვანე პადი","საწმენდის პირდაპირ შესხმა სარკის კიდეზე","ცხიმიანი ნაჭერი"],"how":["საწმენდი შეასხი ნაჭერზე","გაწმინდე ზემოდან ქვემოთ S-მოძრაობით","მშრალი მიკროფიბრით გააპრიალე ზოლების გარეშე"]}],"MECH":[{"k":"glass","n":"მინა / სარკე","c":"blue","ct":"ლურჯი ნაჭერი","tool":"მინის მიკროფიბრა და საწმენდი რეზინა","tech":"საწმენდი ნაჭერზე შეასხი, გაწმინდე ზემოდან ქვემოთ, ბოლოს მშრალი მიკროფიბრით გააპრიალე.","ex":"სააბაზანოს სარკე: ორთქლის კვალი ნესტიანი მინის მიკროფიბრით, შემდეგ მშრალით - ზოლების გარეშე.","w":"სკრაბერის პადი ან ლითონის ღრუბელი - მინაზე ნაკაწრები რჩება."},{"k":"stone","n":"გაპრიალებული ქვა","c":"blue","ct":"ლურჯი ნაჭერი","tool":"რბილი მიკროფიბრა; საჭიროებისას მხოლოდ თეთრი პადი","tech":"ჯერ მშრალად მოაშორე ქვიშა და მტვერი, შემდეგ ნესტიანი ნაჭერი, ბოლოს მაშინვე გაამშრალე.","ex":"მარმარილოს მაგიდა: ფინჯნის კვალი ნესტიანი მიკროფიბრით და ნეიტრალური საწმენდით, ხეხვის გარეშე.","w":"მწვანე ან შავი პადი, ლითონის ღრუბელი - ბზინვა სამუდამოდ იკარგება."},{"k":"tile","n":"ფილა და ნაკერი","c":"yellow","ct":"ყვითელი ნაჭერი","tool":"სკრაბერი ლურჯი პადით; ნაკერისთვის ვიწრო ჯაგრისი","tech":"ფილა სკრაბერით, ნაკერი ვიწრო ჯაგრისით ნაკერის გასწვრივ; ბოლოს ჩამობანა და აშრობა.","ex":"შხაპის ფილა: კირის ნადები ლურჯი პადით და ფილის საწმენდით, ნაკერები წინასწარ დასველებული.","w":"მწვანე ან შავი პადი მოჭიქულ ფილაზე - ბზინვა ქრება და ჭუჭყი უფრო სწრაფად ედება."},{"k":"wc","n":"სანტექნიკა (უნიტაზი)","c":"red","ct":"წითელი ნაჭერი","tool":"უნიტაზის ჯაგრისი და წითელი ნაჭერი - მხოლოდ ამ ზონისთვის","tech":"ჩარეცხე, წაუსვი საწმენდი ფერსოს ქვეშ, დაელოდე მოქმედების დროს, გაწმინდე ჯაგრისით; გარე ნაწილი - ზემოდან ქვემოთ წითელი ნაჭრით.","ex":"ფერსოს ქვეშ ნადები: საწმენდი 5-10 წუთით, შემდეგ ჯაგრისი ძალის გარეშე.","w":"წითელი ნაჭერი ან ხელთათმანი სხვა ზონაში - ინფექციის გადატანის მთავარი მიზეზი."},{"k":"wood","n":"ხის ავეჯი","c":"blue","ct":"ლურჯი ნაჭერი","tool":"რბილი მიკროფიბრა; მტვრისთვის მშრალი ნაჭერი","tech":"ჯერ მშრალად მოაშორე მტვერი, შემდეგ კარგად გაწურული ნაჭერი ბოჭკოს მიმართულებით და მაშინვე აშრობა.","ex":"საწოლის ტუმბო: ჭიქის კვალი - ნესტიანი მიკროფიბრა და ხის საწმენდი, ხეხვის გარეშე.","w":"სველი ნაჭერი და ნებისმიერი პადი - ლაქი თეთრდება და იშლება."},{"k":"carpet","n":"ხალიჩა / ქსოვილი","c":"white","ct":"თეთრი ნაჭერი","tool":"მტვერსასრუტი, თეთრი ბამბის ნაჭერი, ქსოვილის ლაქის საწმენდი","tech":"ლაქა ნაპირიდან ცენტრისკენ მიადე - არ გაუსვა. ბოლოს მშრალი ნაჭრით აიღე ტენი.","ex":"ყავის ლაქა: ცივი წყალი და ქსოვილის საწმენდი, მიდება ნაპირიდან ცენტრისკენ.","w":"ხეხვა და ცხელი წყალი - ლაქა ბოჭკოში ღრმად შედის და ფიქსირდება."},{"k":"floor","n":"მყარი იატაკი","c":"green","ct":"ბრტყელი მოპი","tool":"ბრტყელი მოპი და ორსექციიანი ვედრო","tech":"ჯერ მტვერი, შემდეგ მოპი რვიანის მოძრაობით შორი კუთხიდან კარისკენ; სუფთა და ჭუჭყიანი წყალი ცალ-ცალკე სექციაში.","ex":"ლობის ქვის იატაკი: დილით 8-მდე, ნეიტრალური საწმენდით და კარგად გაწურული მოპით.","w":"ერთი ვედრო სუფთა და ჭუჭყიანი წყლისთვის - ჭუჭყი მთელ იატაკზე ნაწილდება."}],"DEP":[["შესვლა და ვენტილაცია",2,"მსოფლიო სტანდარტი","დააკაკუნე, წარადგინე თავი, შეატყობინე რომ მიმდინარეობს ვიდეო კონტროლი (არსებობის შემთხვევაში) და შედი. ჩართე განათება, გააღე ფანჯარა და შეამოწმე, რა დაზიანება ან დავიწყებული ნივთია ოთახში."],["ნაგავი და გამოყენებული თეთრეული",3,"მსოფლიო სტანდარტი","გამოიტანე ნაგავი ყველა ურნიდან, მოხსენი თეთრეული და პირსახოცები და პირდაპირ ჩანთაში ჩადე - იატაკზე არ დადო."],["სააბაზანოში საწმენდის წასმა",2,"ობიექტის სტანდარტი","წაუსვი საწმენდი უნიტაზს, ნიჟარას და შხაპს, რომ სანამ ოთახს ალაგებ, საშუალებამ იმოქმედოს."],["მტვერი: ზემოდან ქვემოთ",5,"მსოფლიო სტანდარტი","მოაშორე მტვერი ყველაზე მაღალი ზედაპირებიდან დაბლისკენ, საათის ისრის მიმართულებით, ლურჯი ნაჭრით."],["საწოლის გაწყობა",6,"ობიექტის სტანდარტი","გაშალე სუფთა თეთრეული, კუთხეები „კონვერტად“ მოკეცე, ბალიშები სასტუმროს სქემით დაალაგე."],["სააბაზანოს წმენდა",8,"მენეჯერის რჩევა","ფერადი კოდით: ყვითელი - ნიჟარა და შხაპი, წითელი - უნიტაზი. ბოლოს სარკე და ონკანები გააპრიალე."],["ამენითები და პირსახოცები",2,"ობიექტის სტანდარტი","შეავსე საპონი, შამპუნი, ტუალეტის ქაღალდი და ჩამოკიდე სუფთა პირსახოცები სტანდარტის სქემით."],["იატაკი და საბოლოო შემოწმება",3,"მსოფლიო სტანდარტი","მტვერსასრუტი ან მოპი - შორი კუთხიდან კარისკენ. ბოლოს კარიდან შეხედე ოთახს სტუმრის თვალით."]],"STAY":[["კარზე ნიშნის შემოწმება",1,"მსოფლიო სტანდარტი","თუ კარზე „არ შემაწუხოთ“ კიდია - არ შეხვიდე და მონიშნე აპში. სხვა შემთხვევაში დააკაკუნე და წარადგინე თავი."],["ნაგავი და ჭურჭელი",2,"მსოფლიო სტანდარტი","გაასუფთავე ურნები, გაიტანე გამოყენებული ჭიქები და ჭურჭელი. სტუმრის ნივთებს არ შეეხო და ადგილს არ შეუცვალო."],["საწოლის გასწორება",4,"ობიექტის სტანდარტი","თეთრეული გაასწორე; შეცვალე მხოლოდ სტუმრის მოთხოვნით ან სასტუმროს გრაფიკით."],["სააბაზანოს სწრაფი წმენდა",6,"ობიექტის სტანდარტი","ნიჟარა, შხაპი და უნიტაზი ფერადი კოდით; იატაკზე დაგდებული პირსახოცები შეცვალე."],["ამენითების შევსება",2,"ობიექტის სტანდარტი","შეავსე ის, რაც დაიხარჯა: წყალი, ყავა, საპონი, ტუალეტის ქაღალდი."],["იატაკი და შემოწმება",3,"მსოფლიო სტანდარტი","მტვერსასრუტი თავისუფალ ზონებში. ბოლოს შეამოწმე ფანჯარა, განათება და კონდიციონერი."]],"SAN":[["ხელის ჰიგიენა",["დაიბანე ხელი ცვლის დაწყებამდე, ყოველი ოთახის შემდეგ და სანიტარიული კვანძის წმენდის შემდეგ","საპონით, მინიმუმ 20-30 წამი","ხელთათმანის მოხსნის შემდეგაც დაიბანე ხელი"],"ხელთათმანი ხელის დაბანას არ ანაცვლებს."],["ხელთათმანები",["ცალკე წყვილი სანიტარიული კვანძისთვის და ცალკე - ოთახისთვის","დაზიანებული ხელთათმანი მაშინვე შეცვალე","ხელთათმანით არ შეეხო სახელურებს, ტელეფონს და სუფთა თეთრეულს"],"წითელი ზონის ხელთათმანი სხვა ზონაში არ გადის."],["ქიმიის უსაფრთხო შენახვა",["ყველა ბოთლს ეტიკეტი უნდა ჰქონდეს - უსახელო ბოთლს არ გამოიყენო","ქიმია არ გადაასხა სასმელის ბოთლში","ურიკაზე მჟავა და ქლორი ცალ-ცალკე განყოფილებაში"],"უსაფრთხოების ფურცელი (SDS) ყოველთვის ხელმისაწვდომი უნდა იყოს."],["ჯვარედინი დაბინძურება",["ფერადი კოდი: წითელი - უნიტაზი, ყვითელი - ნიჟარა და შხაპი, ლურჯი - ზედაპირები, მწვანე - საკვები","წმენდე სუფთადან ჭუჭყიანისკენ","ჭიქები და მინიბარი - ცალკე ნაჭრით"],"ერთი ნაჭერი - ერთი ზონა."],["სისხლი და ბიოლოგიური ნარჩენი",["ჩაიცვი ერთჯერადი ხელთათმანები","ჯერ აიღე შთამნთქმელი ხელსახოცით, შემდეგ დეზინფექცია","ნარჩენი ცალკე დახურულ ტომარაში; აცნობე მენეჯერს"],"ნემსს ან ბასრ საგანს ხელით არ შეეხო - გამოიძახე მენეჯერი."],["დეზინფექცია და ვენტილაცია",["დეზინფექციის საშუალებას სჭირდება მოქმედების დრო - იხილე ეტიკეტი","ჯერ გაწმინდე, შემდეგ დეზინფექცია - ჭუჭყზე საშუალება არ მოქმედებს","ქიმიით მუშაობისას ფანჯარა ან ვენტილაცია ჩართული უნდა იყოს"],"შხეფისგან დაიცავი თვალები - სპრეი ნაჭერზე შეასხი."]],"CASES":[{"cat":"stone","src":"[რეგიონული სასტუმრო · იმერეთი]","tag":"ქვა · მარმარილო","t":"ლობის მარმარილოს იატაკი და კირის საწმენდი","what":"იატაკს რამდენიმე კვირა კირის (მჟავა) საწმენდით წმენდდნენ. გაჩნდა მქრქალი ზოლები და ბზინვა დაიკარგა.","fix":"პროფესიული გაპრიალება, შემდეგ მხოლოდ pH-ნეიტრალური ქვის საწმენდი.","les":"ლობის ქვისთვის ცალკე, ფერადად მარკირებული ბოთლი - შეცდომა აღარ განმეორდა.","res":"ზარალი მინიმუმამდე დავიდა","u":24},{"cat":"wood","src":"[საოჯახო სასტუმრო · კახეთი]","tag":"ავეჯი · ხე","t":"რესტორნის ხის მაგიდები და უნივერსალური სპრეი","what":"მაგიდებს ყოველდღე უნივერსალური სახლის სპრეით და სველი ნაჭრით წმენდდნენ. ლაქები გაქრა, დარჩა თეთრი წვეთოვანი ლაქები.","fix":"ხის ნეიტრალური საწმენდი, კარგად გაწურული მიკროფიბრა და პერიოდული მოვლის ზეთი.","les":"ხესთან „ნაკლები წყალი - უკეთესი“. დაზიანებული მაგიდები ადრეულ ეტაპზე გადაარჩინეს.","res":"ზარალი თავიდან აიცილეს","u":17},{"cat":"metal","src":"[სასტუმრო · აჭარა]","tag":"ლითონი · ფოლადი","t":"ზღვისპირა მოაჯირი და ქლორი","what":"უჟანგავი ფოლადის მოაჯირს ქლორიანი საშუალებით წმენდდნენ. გაჩნდა ჟანგის წერტილები.","fix":"ფოლადის სპეციალური საწმენდი და დამცავი საშუალება; ქლორი ლითონზე აიკრძალა.","les":"ზღვის ჰაერი + ქლორი = სწრაფი კოროზია. ფოლადის მოვლა თვეში ერთხელ.","res":"ზარალი მინიმუმამდე დავიდა","u":11},{"cat":"stone","src":"[ბუტიკ სასტუმრო · სამეგრელო]","tag":"ქვა · ბაზალტი","t":"ბაზალტის აბაზანა და კირის ნადები","what":"შხაპის კედელზე კირის ნადებს სახლის ქიმიით ვერ აშორებდნენ: დიდი დრო და ხარჯი, შედეგი კი არა.","fix":"ფილის მჟავა საწმენდი სწორი განზავებით, ნაკერების წინასწარ დასველებით და უხვი ჩამობანით.","les":"სწორმა სამეწარმეო ქიმიამ ერთ ცვლაში გააკეთა ის, რასაც სახლის ქიმია კვირობით ვერ ახერხებდა.","res":"დრო და ხარჯი დაიზოგა","u":9}],"DMG":[{"k":"etch","n":"მქრქალი ლაქა ქვაზე","s":"მარმარილო, ტრავერტინი","b":"მსუბუქი - თავად · ღრმა - სპეციალისტი","why":"მჟავამ (ლიმონი, ღვინო, ძმარი, კირის საწმენდი) ქვის ზედაპირი გახსნა - ეს ლაქა კი არა, ზედაპირის დაზიანებაა.","st":["შეწყვიტე ამ საშუალების გამოყენება და ადგილი სუფთა წყლით ჩამოიბანე","გაამშრალე და გადაუღე ფოტო","აცნობე მენეჯერს - ნუ ეცდები სხვა ქიმიით „გამოსწორებას“"],"w":"ცვილით ან პოლიროლით დაფარვა - პრობლემას მალავს და აღდგენას ართულებს.","ex":"მსუბუქ, ზედაპირულ ლაქაზე - მარმარილოს გაპრიალების ფხვნილი ან პასტა, განვრთნილი თანამშრომლის მიერ. ღრმა დაზიანებაზე - ზედაპირის ხელახალი დამუშავება და გაპრიალება სპეციალისტის მიერ.","pr":"მარმარილოს გაპრიალების პასტა / ფხვნილი (მსუბუქი დაზიანება)"},{"k":"color","n":"ფერის დაკარგვა / გაუფერულება","s":"ქვა, ნაკერები","b":"ხშირად - სპეციალისტი","why":"ქლორმა ან ძლიერმა ტუტემ ქვის ან ნაკერის პიგმენტი დაშალა, ან ფორებში საწმენდის ნარჩენი დარჩა.","st":["შეწყვიტე საშუალების გამოყენება და ადგილი უხვად ჩამოიბანე","გაამშრალე და გადაუღე ფოტო დღის შუქზე","აცნობე მენეჯერს - ფერს სხვა ქიმიით ნუ „აღადგენ“"],"w":"საღებავი ან მარკერი ნაკერზე - შემდეგ პროფესიულ აღდგენას ართულებს.","ex":"ქვაზე - ღრმა წმენდა და საჭიროებისას ხელახალი გაპრიალება; ნაკერზე - ნაკერის გაწმენდა ან შეცვლა და დამცავი ფენის დატანა.","pr":"ნაკერის აღმდგენი / ქვის ფორების ღრმა საწმენდი"},{"k":"scratch","n":"ნაკაწრი","s":"გაპრიალებული ქვა, ფოლადი","b":"მსუბუქი - თავად · ღრმა - სპეციალისტი","why":"ქვიშამ, აბრაზიულმა პადმა ან ლითონის ღრუბელმა ზედაპირი გახეხა.","st":["მოაშორე ზედაპირიდან ქვიშა და ნაწილაკები მშრალად","ნაკაწრს ნუ „გახეხავ“ - ეს მას აფართოებს","გადაუღე ფოტო გვერდითი შუქით და აცნობე მენეჯერს"],"w":"ფოლადზე ნაკაწრის „გასწორება“ ლითონის ღრუბლით - ახალ ნაკაწრებს ქმნის.","ex":"ქვაზე - ეტაპობრივი გაპრიალება ალმასის დისკებით; ფოლადზე - ბოჭკოს მიმართულებით სპეციალური ღრუბლით, გამოცდილი თანამშრომლის მიერ.","pr":"ქვის გაპრიალების დისკები / ფოლადის აღმდგენი ნაკრები"},{"k":"ring","n":"თეთრი კვალი ხეზე","s":"ლაქით დამუშავებული ავეჯი","b":"ხშირად - თავად","why":"ცხელმა ჭიქამ ან წყალმა ლაქის ფენაში ტენი დატოვა - ეს ზედაპირული კვალია, ხე ხშირად დაუზიანებელია.","st":["ადგილი მაშინვე გაამშრალე რბილი ნაჭრით","ნუ გამოიყენებ წყალს და უნივერსალურ სპრეის","გადაუღე ფოტო და აცნობე მენეჯერს"],"w":"კბილის პასტა, ცხელი უთო და „სახალხო“ რჩევები - ლაქს უფრო აზიანებს.","ex":"მსუბუქ კვალზე - ხის მოვლის საშუალება ან სპეციალური კვალის მოსაშორებელი; ღრმა კვალზე - ლაქის ფენის განახლება ხელოსნის მიერ.","pr":"ხის ავეჯის აღმდგენი / პოლიროლი"},{"k":"rust","n":"ჟანგის წერტილები","s":"უჟანგავი ფოლადი","b":"ადრეულ ეტაპზე - თავად","why":"ქლორმა ან მარილმა (ზღვის ჰაერმა) ფოლადის დამცავი ფენა დაარღვია.","st":["ქლორიანი საშუალება მაშინვე ამოიღე ამ ზონიდან","გაწმინდე ნეიტრალური საწმენდით, ჩამოიბანე და გაამშრალე","გადაუღე ფოტო და აცნობე მენეჯერს"],"w":"ლითონის ღრუბლით ჟანგის მოშორება - ფოლადის ნაწილაკები ჩარჩება და ჟანგი უფრო სწრაფად ბრუნდება.","ex":"ფოლადის პასივაციის საშუალება ან ჟანგის რბილი მოსაშორებელი, შემდეგ დამცავი ფენა; ზღვისპირა ზონაში მოვლა თვეში ერთხელ.","pr":"უჟანგავი ფოლადის გამწმენდი და დამცავი"}],"HH":[{"k":"stone","n":"ქვის საწმენდი არ მაქვს","pro":"pH-ნეიტრალური ქვის საწმენდი","sub":"ნეიტრალური ჭურჭლის სითხე - რამდენიმე წვეთი 1 ლიტრ თბილ წყალზე. სურნელის, ლიმონის და „ანტიბაქტერიული“ დანამატის გარეშე.","ok":"მარმარილო, ტრავერტინი, კირქვა, გრანიტი, ბაზალტი - ყოველდღიური წმენდა და ახალი ლაქა","no":["ძმარი, ლიმონი, ლიმონმჟავა","„უნივერსალური“ სპრეი, თუ ეტიკეტზე მჟავა ან ქლორი წერია","სამზარეულოს ღრუბლის მწვანე მხარე"],"st":["ლაქა ჯერ ქაღალდის ხელსახოცით აიღე - მიადე, არ გაუსვა","გაწმინდე ხსნარში დასველებული და კარგად გაწურული მიკროფიბრით","ჩამოიბანე სუფთა წყლით და მაშინვე გაამშრალე - ზედმეტი საპონი ფენას ტოვებს"],"risk":"დაბალი, თუ სითხე ნამდვილად ნეიტრალურია და კარგად ჩამოიბანე."},{"k":"glass","n":"მინის საწმენდი არ მაქვს","pro":"სპირტზე დაფუძნებული მინის საწმენდი","sub":"70%-იანი სპირტი, წყალთან 1:1 შერეული; ან თბილი წყალი ჭურჭლის სითხის ერთი წვეთით.","ok":"სარკე, ფანჯარა, მინის მაგიდა, შხაპის მინა","no":["ძმრის ხსნარი, თუ ქვემოთ ქვის რაფა ან ქვის თარო ახლავს - წვეთები ქვას აზიანებს","საწმენდის პირდაპირ შესხმა სარკის კიდეზე","ქაღალდის ხელსახოცი - ბოჭკოს ტოვებს"],"st":["ხსნარი შეასხი ნაჭერზე და არა სარკეზე","გაწმინდე ზემოდან ქვემოთ","გააპრიალე მშრალი მინის მიკროფიბრით"],"risk":"დაბალი. სპირტი არ გამოიყენო ლაქით ან ფირით დაფარულ მინაზე."},{"k":"lime","n":"კირის საწმენდი არ მაქვს","pro":"მჟავა ფილის / სანტექნიკის საწმენდი","sub":"ლიმონმჟავა - 1 სუფრის კოვზი 0.5 ლიტრ თბილ წყალზე, ან სახლის კირის მოსაშორებელი, ეტიკეტის მიხედვით.","ok":"მოჭიქული კერამიკა, ფაიფური, ქრომირებული ონკანი, შხაპის მინა","no":["მარმარილო, ტრავერტინი, კირქვა - ერთი წვეთიც კი მქრქალ ლაქას ტოვებს","ქლორიანი საშუალების შემდეგ ან მასთან ერთად - ტოქსიკური აირი","ბაზალტის ან გრანიტის ფილა მენეჯერის თანხმობის გარეშე"],"st":["ნაკერები და ახლომდებარე ზედაპირი ჯერ სუფთა წყლით დაასველე","წაუსვი ხსნარი, დაელოდე 3-5 წუთს, გახეხე ლურჯი ან თეთრი პადით","უხვად ჩამოიბანე - მჟავა ზედაპირზე არ დატოვო"],"risk":"საშუალო. მჟავა ყველაზე ხშირი მიზეზია ქვის დაზიანების - ჯერ დარწმუნდი, რომ ზედაპირი ქვა არ არის."},{"k":"grease","n":"ცხიმის საწმენდი არ მაქვს","pro":"ტუტე სამეწარმეო ცხიმის საწმენდი","sub":"ცხელი წყალი და ჭურჭლის სითხე; მიმწვარ ცხიმზე - საჭმლის სოდის პასტა (სოდა + ცოტა წყალი).","ok":"მინიბარი, სამზარეულოს ფილა, ფოლადის ზედაპირი, კერამიკა","no":["სოდის პასტა გაპრიალებულ ქვაზე და ლაქიან ხეზე - მსუბუქად ხეხავს","„ორთქლი + ქიმია“ ხის ზედაპირზე","ღუმელის სპრეი ალუმინზე და ფოლადის გარეთ"],"st":["ცხიმი ჯერ ქაღალდით აიღე","გაწმინდე ცხელი წყლით და საპნით; სოდის პასტა - რბილი მოძრაობით","ჩამოიბანე და გაამშრალე მწვანე ნაჭრით"],"risk":"დაბალი, სოდის ფრთხილი გამოყენებისას."},{"k":"dis","n":"დეზინფექციის საშუალება არ მაქვს","pro":"სერტიფიცირებული დეზინფექციის საშუალება","sub":"სახლის ქლორი (ჰიპოქლორიტი) ეტიკეტზე მითითებული განზავებით, ცივ წყალში; მცირე ზედაპირებზე - 70%-იანი სპირტი.","ok":"უნიტაზი, ნიჟარა, შხაპის ფილა (ქლორი); სახელურები, პულტი, ჩამრთველები (სპირტი)","no":["მჟავასთან, კირის საწმენდთან ან ამიაკთან ერთად - ტოქსიკური აირი","უჟანგავ ფოლადზე, ქვაზე და ქსოვილზე","დახურულ, ვენტილაციის გარეშე სივრცეში"],"st":["ჯერ ზედაპირი ჩვეულებრივად გაწმინდე - ჭუჭყზე დეზინფექცია არ მოქმედებს","წაუსვი ხსნარი და დატოვე ეტიკეტზე მითითებული დრო","ჩამოიბანე, გააღე ფანჯარა, ხელთათმანები სავალდებულოა"],"risk":"მაღალი, თუ შერევის წესი დაირღვა. ერთ ვედროში - მხოლოდ ერთი საშუალება."},{"k":"wood","n":"ხის საწმენდი არ მაქვს","pro":"ხის ნეიტრალური საწმენდი / მოვლის საშუალება","sub":"ოდნავ ნესტიანი მიკროფიბრა; საჭიროებისას ერთი წვეთი ჭურჭლის სითხე ჭიქა წყალზე.","ok":"ლაქით ან ზეთით დამუშავებული ავეჯი, კარი, საწოლის ტუმბო","no":["უნივერსალური და სამზარეულოს სპრეი","ძმარი და ზეთის „სახლის რეცეპტები“ ლაქიან ზედაპირზე","სველი ნაჭერი და ორთქლი"],"st":["მტვერი ჯერ მშრალად მოაშორე","გაწმინდე კარგად გაწურული ნაჭრით ბოჭკოს მიმართულებით","მაშინვე გაამშრალე მშრალი ნაჭრით"],"risk":"დაბალი, თუ წყალი მინიმალურია."},{"k":"steel","n":"ფოლადის საწმენდი არ მაქვს","pro":"უჟანგავი ფოლადის საწმენდი და დამცავი","sub":"თბილი წყალი ჭურჭლის სითხით; თითის კვალზე - 70%-იანი სპირტი.","ok":"ონკანი, მოაჯირი, მაცივრის და ლიფტის კარი","no":["ქლორი და ქლორიანი კრემ-საწმენდები","ლითონის ღრუბელი, ფხვნილი","მარილმჟავიანი WC საშუალება"],"st":["გაწმინდე ბოჭკოს მიმართულებით","ჩამოიბანე სუფთა წყლით","გააპრიალე მშრალი მიკროფიბრით"],"risk":"დაბალი."},{"k":"carpet","n":"ქსოვილის ლაქის საწმენდი არ მაქვს","pro":"ქსოვილის და ხალიჩის ლაქის საწმენდი","sub":"ცივი წყალი და ჭურჭლის სითხის რამდენიმე წვეთი; ცხიმიან ლაქაზე - საჭმლის სოდა 15 წუთით, შემდეგ მტვერსასრუტი.","ok":"ხალიჩა, ფარდა, სავარძლის გადასაკრავი","no":["ცხელი წყალი ღვინოზე, სისხლზე და ყავაზე - ლაქა ფიქსირდება","ქლორი და წყალბადის ზეჟანგი ფერად ქსოვილზე","ხეხვა - ბოჭკო ზიანდება და ლაქა ფართოვდება"],"st":["ლაქა მიადე თეთრი ნაჭრით ნაპირიდან ცენტრისკენ","ხსნარი ჯერ შეუმჩნეველ ადგილზე სცადე","ბოლოს სუფთა წყლით და მშრალი ნაჭრით აიღე ტენი"],"risk":"საშუალო - ფერადი ქსოვილი ყოველთვის ჯერ შეამოწმე."}],"LABEL":[["მჟავა, acid, ლიმონმჟავა, ძმარმჟავა, „კირის საწინააღმდეგო“","მჟავა","მარმარილო, ტრავერტინი, კირქვა, ნაკერი"],["ჰიპოქლორიტი, ქლორი, chlorine, „მათეთრებელი“","ქლორი","ფოლადი, ქვა, ფერადი ქსოვილი; მჟავასთან და ამიაკთან შერევა"],["ამიაკი, ammonia","ამიაკი","ხე, ქლორთან შერევა"],["აბრაზიული, ფხვნილი, „სკრაბი“","ხეხავს","გაპრიალებული ქვა, მინა, ფოლადი, ლაქიანი ხე"],["ნეიტრალური, pH 7, „ნაზი“","ნეიტრალური","ყველაზე უსაფრთხო - ჩვეულებრივ ყველგან"]],"HCASES":[["ok","[სასტუმრო · თბილისი]","ქვის საწმენდი დამთავრდა - ლობის მარმარილო","ღამის ცვლაში ლობის იატაკზე ყავა დაიღვარა. დიასახლისმა ნეიტრალური ჭურჭლის სითხის სუსტი ხსნარი გამოიყენა, ჩამობანა და გაამშრალა, დილით კი მენეჯერს პროფესიული საშუალება მოსთხოვა.","ზიანი არ მომხდარა - სწორი დროებითი გამოსავალი."],["bad","[საოჯახო სასტუმრო · მცხეთა]","ძმრით ნაწმენდი სარკე და მარმარილოს თარო","მინის საწმენდის ნაცვლად სარკე ძმრის ხსნარით გაწმინდეს. ხსნარი ქვემოთ მარმარილოს თაროზე ჩაიწვეთა და მქრქალი წერტილები დატოვა.","სახლის ქიმიის შერჩევისას შეხედე არა მხოლოდ ზედაპირს, არამედ იმასაც, რაზეც ჩაიწვეთება."],["bad","[სასტუმრო · ბორჯომი]","ქლორის გელი და კირის WC საშუალება ზედიზედ","უნიტაზს ჯერ ქლორიანი გელი, შემდეგ მჟავა კირის საშუალება წაუსვეს ჩამობანის გარეშე. ოთახში მძაფრი სუნი დადგა, თანამშრომელს თავბრუ დაეხვა.","ორ საშუალებას შორის - ჩამორეცხვა და ვენტილაცია. საუკეთესოა ერთ ცვლაში მხოლოდ ერთი."],["ok","[გესთჰაუსი · სიღნაღი]","ცხიმის საწმენდის გარეშე - მინიბარი","მინიბარის ფოლადის თაროზე ცხიმი იყო. გამოიყენეს ცხელი წყალი, ჭურჭლის სითხე და საჭმლის სოდის რბილი პასტა, ბოჭკოს მიმართულებით.","ეფექტური და უსაფრთხო, ნაკაწრების გარეშე."]],"TROLLEY":[["4 ფერის მიკროფიბრა (თითოეული 5+)",1],["მინის მიკროფიბრა და საწმენდი რეზინა"],["სკრაბერი თეთრი და ლურჯი პადით"],["ნაკერის ვიწრო ჯაგრისი"],["უნიტაზის ჯაგრისი"],["ბრტყელი მოპი და ორსექციიანი ვედრო"],["დოზატორი ბოთლები ეტიკეტით"],["ხელთათმანები",1]],"QUIZ":[{"t":"chem","q":"ლობის მარმარილოს იატაკზე ყავა დაიღვარა. ხელთ გაქვს: ა) ლიმონმჟავიანი კირის საწმენდი, ბ) pH-ნეიტრალური ქვის საწმენდი, გ) ქლორიანი გელი. რომელს აირჩევ?","o":["ლიმონმჟავიანი კირის საწმენდი","pH-ნეიტრალური ქვის საწმენდი","ქლორიანი გელი"],"c":1,"e":"მარმარილო კალციტური ქვაა - მჟავა მას ხსნის და მქრქალ ლაქას ტოვებს, ქლორი კი ფერს აზიანებს. სწორია ნეიტრალური საწმენდი, ლაქის მიდებით."},{"t":"sanitary","q":"უნიტაზს ქლორიანი გელი წაუსვი. ახლა კირის ნადებიც გინდა მოაშორო მჟავა WC საშუალებით. რას გააკეთებ?","o":["მაშინვე წავუსვამ მჟავასაც","ჯერ ჩამოვრეცხავ, გავანიავებ და სჯობს მეორე საშუალება სხვა ჯერზე გამოვიყენო","ორივეს ერთ ვედროში შევურევ"],"c":1,"e":"ქლორი + მჟავა ქლორის აირს წარმოქმნის. ორ საშუალებას შორის - ჩამორეცხვა და ვენტილაცია, იდეალურად სხვა დროს."},{"t":"mech","q":"გაპრიალებულ გრანიტის მაგიდაზე მიმხმარი ლაქაა. რომელ პადს აიღებ?","o":["მწვანე","შავი","თეთრი"],"c":2,"e":"გაპრიალებულ ქვაზე მხოლოდ თეთრი (რბილი) პადი. მწვანე და შავი ბზინვას სამუდამოდ აქრობს."},{"t":"chem","q":"ზღვისპირა სასტუმროს ფოლადის მოაჯირს ლაქები აქვს. რომელი საშუალება არ შეიძლება?","o":["ნეიტრალური საწმენდი","ქლორიანი საშუალება","ფოლადის სპეციალური საწმენდი"],"c":1,"e":"ქლორი ფოლადის დამცავ ფენას არღვევს - ზღვის ჰაერთან ერთად სწრაფად ჩნდება ჟანგის წერტილები."},{"t":"household","q":"მინის საწმენდი დაგითავდა. სარკის ქვეშ მარმარილოს თაროა. რას გამოიყენებ?","o":["ძმრის ხსნარს","წყალთან 1:1 შერეულ სპირტს, ნაჭერზე შესხმით","უნივერსალურ სამზარეულოს სპრეის"],"c":1,"e":"ძმრის წვეთი მარმარილოს თაროს დააზიანებს. სპირტის ხსნარი ნაჭერზე შეასხი და არა სარკეზე."}],"DEEP":[["ლობის მარმარილოს გაპრიალება",120,"მარმარილო · თეთრი პადი, ნეიტრალური საწმენდი",30,41,"chem"],["შხაპის ნაკერების ღრმა წმენდა (6 ოთახი)",120,"ბაზალტის ფილა · ნაკერის ჯაგრისი",21,25,"mech"],["დერეფნის ხალიჩის ღრმა წმენდა",120,"ხალიჩა · ქსოვილის საწმენდი",60,64,"mech"],["ლეიბების შემობრუნება (8 ოთახი)",80,"სტანდარტი · 2 ადამიანი",90,70,"standards"],["ხის ავეჯის ზეთით მოვლა (რესტორანი)",60,"ხე · მოვლის ზეთი",30,33,"chem"],["ფოლადის მოაჯირის დამცავი ფენა",45,"უჟანგავი ფოლადი · თვეში ერთხელ",30,29,"chem"],["ფარდების და ჟალუზების მტვერი",90,"ქსოვილი · მტვერსასრუტი",30,18,"mech"],["მინიბარების ღრმა წმენდა (10 ოთახი)",50,"მწვანე ნაჭერი · საკვების ზონა",14,12,"mech"]],"STAFF":[["ნბ","ნინო ბ.",[1,1,0,0,1,1,1]],["ლმ","ლია მ.",[1,0,1,1,0,1,1]],["თკ","თამარ კ.",[0,1,1,0,1,0,1]],["მდ","მარიამ დ.",[0,0,0,1,1,1,0]]],"WD":["ორშ","სამ","ოთხ","ხუთ","პარ","შაბ","კვი"],"WDF":["ორშაბათი","სამშაბათი","ოთხშაბათი","ხუთშაბათი","პარასკევი","შაბათი","კვირა"],"MON":["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი","ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"],"AI":[["სახლის|არ მაქვს|დამთავრდა|გამითავდა","თუ პროფესიული საშუალება არ გაქვს: ჯერ აცნობე მენეჯერს. ქვაზე დროებით - ნეიტრალური ჭურჭლის სითხის სუსტი ხსნარი, ჩამობანა და აშრობა. მჟავა (ძმარი, ლიმონი) ქვაზე არასოდეს. დეტალები - გვერდზე „სახლის ქიმია“."],["ბაზალტ","ბაზალტი მკვრივი ქვაა. ყოველდღიურად - ნეიტრალური საწმენდი. კირის ნადებზე - ფილის მჟავა საწმენდი სწორი განზავებით: ნაკერები ჯერ წყლით დაასველე და ბოლოს უხვად ჩამორეცხე."],["კირ|ნადებ","კირის ნადებზე ჯერ დაადგინე ზედაპირი. გრანიტზე - ქვისთვის დაშვებული სპეციალური საშუალება, ჯერ შეუმჩნეველ ადგილზე სცადე. ბაზალტსა და კერამიკულ ფილაზე - მჟავა ფილის საწმენდი სწორი განზავებით. მარმარილოზე და ტრავერტინზე მჟავა არასოდეს."],["ღვინ|ყავ|ლაქ","ორგანული ლაქა (ღვინო, ყავა) მაშინვე აიღე ქაღალდის ხელსახოცით - მიადე, არ გაუსვა. მარმარილოზე მხოლოდ pH-ნეიტრალური ქვის საწმენდი. სჯობს ჯერ ფოტო-შემოწმება გააკეთო."],["მარმარ|ტრავერტ|კირქვ","მარმარილო მჟავაზე რეაგირებს. გამოიყენე მხოლოდ pH-ნეიტრალური ქვის საწმენდი და რბილი მიკროფიბრა. თუ მქრქალი ლაქა დარჩა - ეს დაზიანებაა, აცნობე მენეჯერს."],["ქლორ.*ფოლად|ფოლად.*ქლორ","არა. ქლორი უჟანგავ ფოლადზე ჟანგის წერტილებს ტოვებს. გამოიყენე ნეიტრალური ან ფოლადის სპეციალური საწმენდი, ბოჭკოს მიმართულებით."],["ფოლად|ონკან|ჟანგ","უჟანგავ ფოლადზე ქლორი აკრძალულია. გამოიყენე ნეიტრალური ან ფოლადის სპეციალური საწმენდი, ბოჭკოს მიმართულებით, ბოლოს მშრალი მიკროფიბრა."],["ხე|ხის|ავეჯ|ჭიქ","ხეზე ნაკლები წყალი - უკეთესი. საწმენდი ნაჭერზე შეასხი, გაწმინდე ბოჭკოს მიმართულებით და მაშინვე გაამშრალე."],["ქლორ|შერე|ურევ","ქლორს არასოდეს შეურიო მჟავა (ქლორის აირი) ან ამიაკი (მომწამვლელი აირი). თუ თავბრუ გეხვევა - გადი ოთახიდან, გააღე ფანჯარა და აცნობე მენეჯერს."],["დაზიან","შეწყვიტე საშუალების გამოყენება, ჩამოიბანე სუფთა წყლით, გადაუღე ფოტო და აცნობე მენეჯერს. დეტალები - გვერდზე „დაზიანებული ზედაპირის აღდგენა“."]],"EXAMPLE":{"verdict":"no","confidence":95,"surface":"მარმარილო (კალციტური ქვა), გაპრიალებული","stain":"ღვინის ლაქა - ორგანული, მჟავიანი","product":"ANTI-KALK კირის საწმენდი","active":"მჟავა (ლიმონმჟავა 10%)","reason":"ლიმონმჟავა მარმარილოს ზედაპირს ხსნის: ღვინის ლაქა შეიძლება მოშორდეს, მაგრამ დარჩება მქრქალი ლაქა, რომელსაც მხოლოდ გაპრიალება აშორებს.","manager":"ოთახი 204: მჟავა საშუალება არ გამოიყენო.","instead":"pH-ნეიტრალური ქვის საწმენდი და რბილი მიკროფიბრა; თუ არ გაქვს - ნეიტრალური ჭურჭლის სითხის სუსტი ხსნარი.","steps":["ლაქა აიღე ქაღალდის ხელსახოცით - მიადე, არ გაუსვა","გაწმინდე განზავებული ნეიტრალური საწმენდით","ჩამოიბანე სუფთა წყლით და მაშინვე გაამშრალე"]}}};

/* ---------- English content (same order as the Georgian data; empty slots reuse the Georgian value, e.g. numbers) ---------- */
DATA.en={
SURF:[
{n:'Marble',sub:'Calcite stone',lt:'High sensitivity',d:'A soft stone that reacts to acid. Even a drop of lemon leaves a dull mark that normal cleaning will not remove.',use:['pH-neutral stone cleaner','Daily stone care product','Soft microfiber and warm water'],never:['Vinegar, lemon, citric acid','Limescale removers and WC products (acidic)','Abrasive powder and steel wool','Chlorine-based products'],how:['First remove dust and grit dry: sand scratches stone','Clean with diluted pH-neutral stone cleaner','Rinse with clean water and dry immediately with microfiber']},
{n:'Travertine',sub:'Porous calcite stone',lt:'High sensitivity',d:'Like marble it reacts to acid, and dirt and water collect in its pores. Excess liquid leaves stains.',use:['pH-neutral stone cleaner','Soft brush for the pores','Well wrung microfiber'],never:['Vinegar, lemon and any acid','Limescale removers','Abrasive powder','Steam cleaning on unfilled pores'],how:['Remove dust with a dry mop or vacuum','Clean with diluted neutral cleaner, pores with a soft brush','Rinse with a little water and dry immediately']},
{n:'Limestone',sub:'Sedimentary calcite stone',lt:'High sensitivity',d:'The softest and most absorbent stone on this list. Acid damages it in seconds, while oil and wine soak in deep.',use:['pH-neutral stone cleaner','Quick blotting of stains with a paper towel','Microfiber and warm water'],never:['Any acid, including "natural" vinegar','Chlorine and ammonia products','Steel wool and powder'],how:['Blot the stain right away: press, do not wipe','Clean with neutral stone cleaner','Dry and tell your manager if a mark remains']},
{n:'Granite',sub:'Silicate stone',lt:'Medium sensitivity',d:'A hard stone that resists acid fairly well, but its protective layer (sealer) wears off with acidic and strong alkaline products.',use:['pH-neutral stone cleaner every day','For limescale: a special product approved for stone','Microfiber'],never:['Strong acid or alkali every day','Abrasive powder on a polished surface','Oily "shine" sprays'],how:['Remove grit dry','Clean with neutral cleaner','For limescale, test the product on a hidden spot first']},
{n:'Basalt',sub:'Volcanic stone',lt:'Medium sensitivity',d:'A dense volcanic stone that tolerates acidic tile cleaner if it is diluted correctly. The grout is the weak point.',use:['Daily: neutral cleaner','For limescale: acidic tile cleaner at the right dilution','Pre-wet the grout with water'],never:['Undiluted acid','Household limescale remover of unknown composition','Leaving acid on the surface without rinsing'],how:['Wet the grout and surface with clean water','Apply diluted cleaner and wait the time on the label','Rinse well and dry']},
{n:'Ceramic / porcelain',sub:'Glazed tile, sink, toilet',lt:'Low sensitivity',d:'The surface most resistant to chemicals. Be careful with grout and the glaze: abrasives remove the shine.',use:['For grease: alkaline cleaner','For limescale: acidic cleaner (wet the grout first)','In sanitary areas: disinfectant'],never:['Using chlorine and acid together or one after another','Abrasive powder on glazed surfaces','Steel wool'],how:['Apply cleaner from top to bottom','Wait for the contact time','Rinse and dry: leave no water marks']},
{n:'Stainless steel',sub:'Taps, railings, appliances',lt:'Medium sensitivity',d:'Chlorine and hydrochloric acid break down the protective layer of steel and leave rust spots, especially in sea air.',use:['Neutral or special steel cleaner','Microfiber, along the grain','Protective product from time to time'],never:['Chlorine-based products','Steel wool and powder','Cleaners with hydrochloric acid'],how:['Clean with neutral cleaner along the grain','Rinse with clean water','Buff with dry microfiber']},
{n:'Wood / furniture',sub:'Varnished or oiled',lt:'High sensitivity',d:'Wood suffers most from excess water and all-purpose sprays: the varnish turns white and swells.',use:['Neutral wood cleaner','Well wrung microfiber','Care oil or polish from time to time'],never:['Wet cloth and excess water','Ammonia and all-purpose sprays','Steam and abrasives'],how:['Remove dust with dry microfiber','Spray cleaner on the cloth, not on the surface','Dry immediately']},
{n:'Glass / mirror',sub:'Windows, mirrors, glass tables',lt:'Low sensitivity',d:'Glass is resistant, but liquid running down to the edges of a mirror damages the silvering and leaves black spots.',use:['Glass cleaner (alcohol based)','Glass microfiber','Squeegee for large surfaces'],never:['Abrasive powder and green pad','Spraying cleaner straight onto a mirror edge','Greasy cloth'],how:['Spray cleaner on the cloth','Wipe from top to bottom in an S motion','Buff with dry microfiber for a streak-free finish']}
],
MECH:[
{n:'Glass / mirror',ct:'Blue cloth',tool:'Glass microfiber and squeegee',tech:'Spray cleaner on the cloth, wipe from top to bottom, then buff with dry microfiber.',ex:'Bathroom mirror: steam marks with damp glass microfiber, then a dry one, without streaks.',w:'Scrub pad or steel wool: leaves scratches on glass.'},
{n:'Polished stone',ct:'Blue cloth',tool:'Soft microfiber; white pad only when needed',tech:'First remove sand and dust dry, then a damp cloth, then dry immediately.',ex:'Marble table: cup ring with damp microfiber and neutral cleaner, without scrubbing.',w:'Green or black pad, steel wool: the shine is lost for good.'},
{n:'Tile and grout',ct:'Yellow cloth',tool:'Scrubber with blue pad; narrow brush for grout',tech:'Tiles with the scrubber, grout with a narrow brush along the joint; then rinse and dry.',ex:'Shower tiles: limescale with a blue pad and tile cleaner, grout pre-wetted.',w:'Green or black pad on glazed tiles: the shine fades and dirt sticks faster.'},
{n:'Sanitary ware (toilet)',ct:'Red cloth',tool:'Toilet brush and red cloth, for this zone only',tech:'Flush, apply cleaner under the rim, wait for the contact time, clean with the brush; outside from top to bottom with the red cloth.',ex:'Deposits under the rim: cleaner for 5-10 minutes, then the brush without force.',w:'Red cloth or gloves in another zone: the main way infection spreads.'},
{n:'Wooden furniture',ct:'Blue cloth',tool:'Soft microfiber; dry cloth for dust',tech:'Remove dust dry first, then a well wrung cloth along the grain, and dry immediately.',ex:'Bedside table: glass ring with damp microfiber and wood cleaner, without scrubbing.',w:'Wet cloth and any pad: the varnish turns white and wears away.'},
{n:'Carpet / fabric',ct:'White cloth',tool:'Vacuum cleaner, white cotton cloth, fabric stain remover',tech:'Blot the stain from the edge to the center: do not rub. Finally lift the moisture with a dry cloth.',ex:'Coffee stain: cold water and fabric cleaner, blotting from the edge to the center.',w:'Rubbing and hot water: the stain goes deep into the fibers and sets.'},
{n:'Hard floor',ct:'Flat mop',tool:'Flat mop and two-compartment bucket',tech:'Dust first, then mop in a figure-eight from the far corner towards the door; clean and dirty water in separate compartments.',ex:'Lobby stone floor: before 8 am, with neutral cleaner and a well wrung mop.',w:'One bucket for clean and dirty water: dirt spreads over the whole floor.'}
],
DEP:[
['Entry and ventilation',,'World standard','Knock, introduce yourself, say that video monitoring is in progress (if there is any) and enter. Turn on the lights, open the window and check for damage or forgotten items in the room.'],
['Trash and used linen',,'World standard','Empty all bins, strip the linen and towels and put them straight into the bag. Do not put them on the floor.'],
['Apply cleaner in the bathroom',,'Property standard','Apply cleaner to the toilet, sink and shower so it can work while you tidy the room.'],
['Dusting: top to bottom',,'World standard','Dust from the highest surfaces downwards, clockwise, with a blue cloth.'],
['Making the bed',,'Property standard','Spread clean linen, fold the corners "envelope" style, arrange the pillows according to the hotel layout.'],
['Cleaning the bathroom',,'Manager advice','By color code: yellow for sink and shower, red for the toilet. Finally polish the mirror and taps.'],
['Amenities and towels',,'Property standard','Refill soap, shampoo, toilet paper and hang fresh towels according to the standard layout.'],
['Floor and final check',,'World standard','Vacuum or mop from the far corner towards the door. Finally look at the room from the door through the guest\'s eyes.']
],
STAY:[
['Check the door sign',,'World standard','If a "Do not disturb" sign is hanging, do not enter and mark it in the app. Otherwise knock and introduce yourself.'],
['Trash and dishes',,'World standard','Empty the bins, take out used glasses and dishes. Do not touch or move the guest\'s belongings.'],
['Straightening the bed',,'Property standard','Straighten the linen; change it only at the guest\'s request or according to the hotel schedule.'],
['Quick bathroom clean',,'Property standard','Sink, shower and toilet by color code; replace towels left on the floor.'],
['Refilling amenities',,'Property standard','Refill what was used: water, coffee, soap, toilet paper.'],
['Floor and check',,'World standard','Vacuum the open areas. Finally check the window, lights and air conditioning.']
],
SAN:[
['Hand hygiene',['Wash your hands before the shift, after each room and after cleaning sanitary areas','With soap, at least 20-30 seconds','Wash your hands after removing gloves too'],'Gloves do not replace hand washing.'],
['Gloves',['A separate pair for sanitary areas and a separate one for the room','Replace damaged gloves immediately','Do not touch handles, phones or clean linen with gloves on'],'Red zone gloves never go to another zone.'],
['Safe storage of chemicals',['Every bottle must have a label: never use an unlabeled bottle','Never pour chemicals into a drinks bottle','On the trolley keep acid and chlorine in separate compartments'],'The safety data sheet (SDS) must always be available.'],
['Cross contamination',['Color code: red for toilets, yellow for sink and shower, blue for surfaces, green for food','Clean from clean to dirty','Glasses and minibar with a separate cloth'],'One cloth, one zone.'],
['Blood and biological waste',['Put on disposable gloves','First pick it up with an absorbent towel, then disinfect','Waste goes in a separate closed bag; tell your manager'],'Never touch a needle or sharp object by hand: call your manager.'],
['Disinfection and ventilation',['A disinfectant needs contact time: see the label','Clean first, then disinfect: it does not work on dirt','When working with chemicals the window or ventilation must be on'],'Protect your eyes from splashes: spray onto the cloth.']
],
CASES:[
{src:'[Regional hotel · Imereti]',tag:'Stone · marble',t:'Lobby marble floor and limescale remover',what:'For several weeks the floor was cleaned with a limescale (acidic) cleaner. Dull streaks appeared and the shine was lost.',fix:'Professional polishing, then only pH-neutral stone cleaner.',les:'A separate, color-marked bottle for the lobby stone: the mistake never happened again.',res:'Losses kept to a minimum'},
{src:'[Family hotel · Kakheti]',tag:'Furniture · wood',t:'Restaurant wooden tables and all-purpose spray',what:'The tables were cleaned every day with an all-purpose household spray and a wet cloth. The varnish disappeared, leaving white water-drop marks.',fix:'Neutral wood cleaner, well wrung microfiber and periodic care oil.',les:'With wood, "less water is better". The damaged tables were saved at an early stage.',res:'Losses avoided'},
{src:'[Hotel · Adjara]',tag:'Metal · steel',t:'Seaside railing and chlorine',what:'The stainless steel railing was cleaned with a chlorine product. Rust spots appeared.',fix:'Special steel cleaner and protective product; chlorine was banned on metal.',les:'Sea air + chlorine = fast corrosion. Steel care once a month.',res:'Losses kept to a minimum'},
{src:'[Boutique hotel · Samegrelo]',tag:'Stone · basalt',t:'Basalt bathroom and limescale',what:'Household chemicals could not remove the limescale on the shower wall: lots of time and money, no result.',fix:'Acidic tile cleaner at the right dilution, grout pre-wetted and rinsed well.',les:'The right professional chemical did in one shift what household products failed to do in weeks.',res:'Time and money saved'}
],
DMG:[
{n:'Dull etch mark on stone',s:'Marble, travertine',b:'Light: yourself · deep: specialist',why:'Acid (lemon, wine, vinegar, limescale remover) dissolved the stone surface: this is not a stain, it is surface damage.',st:['Stop using this product and rinse the spot with clean water','Dry it and take a photo','Tell your manager: do not try to "fix" it with other chemicals'],w:'Covering it with wax or polish hides the problem and makes restoration harder.',ex:'For a light, surface etch: marble polishing powder or paste, applied by a trained staff member. For deep damage: resurfacing and polishing by a specialist.',pr:'Marble polishing paste / powder (light damage)'},
{n:'Color loss / fading',s:'Stone, grout',b:'Often: specialist',why:'Chlorine or a strong alkali broke down the pigment of the stone or grout, or cleaner residue stayed in the pores.',st:['Stop using the product and rinse the spot well','Dry it and photograph it in daylight','Tell your manager: do not "restore" the color with other chemicals'],w:'Paint or marker on grout makes professional restoration harder later.',ex:'On stone: deep cleaning and re-polishing if needed; on grout: cleaning or replacing the grout and applying a protective coat.',pr:'Grout restorer / deep cleaner for stone pores'},
{n:'Scratch',s:'Polished stone, steel',b:'Light: yourself · deep: specialist',why:'Sand, an abrasive pad or steel wool scratched the surface.',st:['Remove sand and particles from the surface dry','Do not "rub out" the scratch: that makes it wider','Photograph it with side light and tell your manager'],w:'"Fixing" a scratch on steel with steel wool creates new scratches.',ex:'On stone: step-by-step polishing with diamond pads; on steel: with a special pad along the grain, by an experienced staff member.',pr:'Stone polishing pads / steel restoration kit'},
{n:'White mark on wood',s:'Varnished furniture',b:'Often: yourself',why:'A hot glass or water left moisture in the varnish layer: this is a surface mark and the wood is often undamaged.',st:['Dry the spot right away with a soft cloth','Do not use water or all-purpose spray','Take a photo and tell your manager'],w:'Toothpaste, a hot iron and "folk" tips damage the varnish further.',ex:'For a light mark: wood care product or a special ring remover; for a deep mark: refinishing the varnish by a craftsman.',pr:'Wood furniture restorer / polish'},
{n:'Rust spots',s:'Stainless steel',b:'At an early stage: yourself',why:'Chlorine or salt (sea air) broke down the protective layer of the steel.',st:['Remove the chlorine product from this zone right away','Clean with neutral cleaner, rinse and dry','Take a photo and tell your manager'],w:'Removing rust with steel wool: steel particles get stuck and rust comes back faster.',ex:'Steel passivation product or a mild rust remover, then a protective coat; in seaside areas care once a month.',pr:'Stainless steel cleaner and protector'}
],
HH:[
{n:'No stone cleaner',pro:'pH-neutral stone cleaner',sub:'Neutral dish soap: a few drops in 1 liter of warm water. No fragrance, lemon or "antibacterial" additives.',ok:'Marble, travertine, limestone, granite, basalt: daily cleaning and fresh stains',no:['Vinegar, lemon, citric acid','"All-purpose" spray if the label says acid or chlorine','The green side of a kitchen sponge'],st:['Blot the stain first with a paper towel: press, do not wipe','Clean with microfiber dampened in the solution and wrung out well','Rinse with clean water and dry right away: extra soap leaves a film'],risk:'Low, if the liquid is truly neutral and you rinse well.'},
{n:'No glass cleaner',pro:'Alcohol-based glass cleaner',sub:'70% alcohol mixed 1:1 with water; or warm water with one drop of dish soap.',ok:'Mirrors, windows, glass tables, shower glass',no:['Vinegar solution if there is a stone sill or stone shelf below: drops damage the stone','Spraying cleaner straight onto a mirror edge','Paper towels: they leave lint'],st:['Spray the solution on the cloth, not on the mirror','Wipe from top to bottom','Buff with dry glass microfiber'],risk:'Low. Do not use alcohol on varnished or filmed glass.'},
{n:'No limescale remover',pro:'Acidic tile / sanitary cleaner',sub:'Citric acid: 1 tablespoon in 0.5 liter of warm water, or a household limescale remover used as the label says.',ok:'Glazed ceramic, porcelain, chrome taps, shower glass',no:['Marble, travertine, limestone: even one drop leaves a dull mark','After or together with a chlorine product: toxic gas','Basalt or granite tiles without the manager\'s approval'],st:['First wet the grout and nearby surface with clean water','Apply the solution, wait 3-5 minutes, scrub with a blue or white pad','Rinse well: do not leave acid on the surface'],risk:'Medium. Acid is the most common cause of stone damage: first make sure the surface is not stone.'},
{n:'No degreaser',pro:'Alkaline professional degreaser',sub:'Hot water and dish soap; for burnt-on grease, a baking soda paste (soda + a little water).',ok:'Minibar, kitchen tiles, steel surfaces, ceramics',no:['Soda paste on polished stone and varnished wood: it scratches lightly','"Steam + chemicals" on wood','Oven spray on aluminum and outside steel'],st:['Lift the grease with paper first','Clean with hot water and soap; soda paste with a gentle motion','Rinse and dry with a green cloth'],risk:'Low, with careful use of soda.'},
{n:'No disinfectant',pro:'Certified disinfectant',sub:'Household bleach (hypochlorite) at the dilution on the label, in cold water; on small surfaces, 70% alcohol.',ok:'Toilet, sink, shower tiles (bleach); handles, remote, switches (alcohol)',no:['With acid, limescale remover or ammonia: toxic gas','On stainless steel, stone and fabric','In a closed space without ventilation'],st:['Clean the surface normally first: disinfectant does not work on dirt','Apply the solution and leave it for the time on the label','Rinse, open the window, gloves are mandatory'],risk:'High if the mixing rule is broken. One bucket, one product only.'},
{n:'No wood cleaner',pro:'Neutral wood cleaner / care product',sub:'A slightly damp microfiber; if needed, one drop of dish soap in a glass of water.',ok:'Varnished or oiled furniture, doors, bedside tables',no:['All-purpose and kitchen sprays','Vinegar and oil "home recipes" on varnished surfaces','Wet cloth and steam'],st:['Remove dust dry first','Clean with a well wrung cloth along the grain','Dry right away with a dry cloth'],risk:'Low, if water is kept to a minimum.'},
{n:'No steel cleaner',pro:'Stainless steel cleaner and protector',sub:'Warm water with dish soap; for fingerprints, 70% alcohol.',ok:'Taps, railings, fridge and elevator doors',no:['Chlorine and chlorine cream cleaners','Steel wool, powder','WC product with hydrochloric acid'],st:['Clean along the grain','Rinse with clean water','Buff with dry microfiber'],risk:'Low.'},
{n:'No fabric stain remover',pro:'Fabric and carpet stain remover',sub:'Cold water and a few drops of dish soap; on a greasy stain, baking soda for 15 minutes, then vacuum.',ok:'Carpets, curtains, upholstery',no:['Hot water on wine, blood and coffee: the stain sets','Chlorine and hydrogen peroxide on colored fabric','Rubbing: the fiber gets damaged and the stain spreads'],st:['Blot the stain with a white cloth from the edge to the center','Test the solution on a hidden spot first','Finally lift the moisture with clean water and a dry cloth'],risk:'Medium: always test colored fabric first.'}
],
LABEL:[
['Acid, citric acid, acetic acid, "anti-limescale"','Acid','Marble, travertine, limestone, grout'],
['Hypochlorite, chlorine, "bleach"','Chlorine','Steel, stone, colored fabric; mixing with acid and ammonia'],
['Ammonia','Ammonia','Wood, mixing with chlorine'],
['Abrasive, powder, "scrub"','Scratches','Polished stone, glass, steel, varnished wood'],
['Neutral, pH 7, "gentle"','Neutral','The safest: usually fine everywhere']
],
HCASES:[
[,'[Hotel · Tbilisi]','Stone cleaner ran out: lobby marble','During the night shift coffee was spilled on the lobby floor. The housekeeper used a weak solution of neutral dish soap, rinsed and dried it, and in the morning asked the manager for a professional product.','No damage: the right temporary solution.'],
[,'[Family hotel · Mtskheta]','Mirror cleaned with vinegar and a marble shelf','The mirror was cleaned with a vinegar solution instead of glass cleaner. The solution dripped onto the marble shelf below and left dull spots.','When choosing household chemicals, look not only at the surface but also at what it will drip onto.'],
[,'[Hotel · Borjomi]','Chlorine gel and acidic WC product one after another','First a chlorine gel, then an acidic limescale product were applied to the toilet without rinsing. A sharp smell filled the room and the staff member felt dizzy.','Between two products: rinse and ventilate. Best of all, only one per shift.'],
[,'[Guesthouse · Sighnaghi]','No degreaser: the minibar','There was grease on the steel minibar shelf. Hot water, dish soap and a soft baking soda paste were used, along the grain.','Effective and safe, no scratches.']
],
TROLLEY:[['Microfiber in 4 colors (5+ of each)'],['Glass microfiber and squeegee'],['Scrubber with white and blue pads'],['Narrow grout brush'],['Toilet brush'],['Flat mop and two-compartment bucket'],['Labeled dispenser bottles'],['Gloves']],
QUIZ:[
{q:'Coffee was spilled on the lobby marble floor. You have: a) citric acid limescale remover, b) pH-neutral stone cleaner, c) chlorine gel. Which do you choose?',o:['Citric acid limescale remover','pH-neutral stone cleaner','Chlorine gel'],e:'Marble is a calcite stone: acid dissolves it and leaves a dull mark, and chlorine damages the color. The right choice is a neutral cleaner, blotting the stain.'},
{q:'You applied chlorine gel to the toilet. Now you also want to remove limescale with an acidic WC product. What do you do?',o:['Apply the acid right away too','First rinse and ventilate, and preferably use the second product another time','Mix both in one bucket'],e:'Chlorine + acid produces chlorine gas. Between two products: rinse and ventilate, ideally at a different time.'},
{q:'There is a dried stain on a polished granite table. Which pad do you take?',o:['Green','Black','White'],e:'On polished stone only a white (soft) pad. Green and black remove the shine for good.'},
{q:'The steel railing of a seaside hotel has stains. Which product must not be used?',o:['Neutral cleaner','Chlorine product','Special steel cleaner'],e:'Chlorine breaks down the protective layer of steel: combined with sea air, rust spots appear quickly.'},
{q:'You ran out of glass cleaner. There is a marble shelf under the mirror. What do you use?',o:['Vinegar solution','Alcohol mixed 1:1 with water, sprayed on the cloth','All-purpose kitchen spray'],e:'A drop of vinegar will damage the marble shelf. Spray the alcohol solution on the cloth, not on the mirror.'}
],
DEEP:[
['Polishing the lobby marble',,'Marble · white pad, neutral cleaner'],
['Deep cleaning shower grout (6 rooms)',,'Basalt tile · grout brush'],
['Deep cleaning the corridor carpet',,'Carpet · fabric cleaner'],
['Turning mattresses (8 rooms)',,'Standard · 2 people'],
['Oiling wooden furniture (restaurant)',,'Wood · care oil'],
['Protective coat on the steel railing',,'Stainless steel · once a month'],
['Dusting curtains and blinds',,'Fabric · vacuum cleaner'],
['Deep cleaning minibars (10 rooms)',,'Green cloth · food area']
],
STAFF:[['NB','Nino B.'],['LM','Lia M.'],['TK','Tamar K.'],['MD','Mariam D.']],
WD:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
WDF:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
MON:['January','February','March','April','May','June','July','August','September','October','November','December'],
AI:[
['household|don.?t have|ran out|run out|no (stone|glass|professional)','If you have no professional product: first tell your manager. On stone, as a temporary fix, use a weak solution of neutral dish soap, then rinse and dry. Never use acid (vinegar, lemon) on stone. Details on the "Household chemicals" page.'],
['basalt','Basalt is a dense stone. Daily: neutral cleaner. For limescale: acidic tile cleaner at the right dilution. Wet the grout with water first and rinse well at the end.'],
['lime|scale|calc','For limescale, first identify the surface. On granite: a special product approved for stone, tested on a hidden spot first. On basalt and ceramic tiles: acidic tile cleaner at the right dilution. Never acid on marble or travertine.'],
['wine|coffee|stain','Blot an organic stain (wine, coffee) right away with a paper towel: press, do not wipe. On marble use only pH-neutral stone cleaner. It is best to do a photo check first.'],
['marble|travertine|limestone','Marble reacts to acid. Use only pH-neutral stone cleaner and a soft microfiber. If a dull mark remains, it is damage: tell your manager.'],
['chlorine.*steel|steel.*chlorine|bleach.*steel','No. Chlorine leaves rust spots on stainless steel. Use a neutral or special steel cleaner, along the grain.'],
['steel|tap|rust','Chlorine is not allowed on stainless steel. Use a neutral or special steel cleaner, along the grain, then a dry microfiber.'],
['wood|furniture|glass ring|table','With wood, less water is better. Spray cleaner on the cloth, wipe along the grain and dry right away.'],
['chlorine|bleach|mix','Never mix chlorine with acid (chlorine gas) or ammonia (toxic gas). If you feel dizzy, leave the room, open the window and tell your manager.'],
['damage','Stop using the product, rinse with clean water, take a photo and tell your manager. Details on the "Restoring damaged surfaces" page.']
],
EXAMPLE:{surface:'Marble (calcite stone), polished',stain:'Wine stain: organic, acidic',product:'ANTI-KALK limescale remover',active:'Acid (citric acid 10%)',reason:'Citric acid dissolves the marble surface: the wine stain may come off, but a dull mark will remain that only polishing can remove.',manager:'Room 204: do not use an acidic product.',instead:'pH-neutral stone cleaner and a soft microfiber; if you have none, a weak solution of neutral dish soap.',steps:['Blot the stain with a paper towel: press, do not wipe','Clean with diluted neutral cleaner','Rinse with clean water and dry right away']}
};

/* ---------- Russian content (same order as the Georgian data) ---------- */
DATA.ru={
SURF:[
{n:'Мрамор',sub:'Кальцитовый камень',lt:'Высокая чувствительность',d:'Мягкий камень, реагирует на кислоту. Даже капля лимона оставляет матовое пятно, которое обычной уборкой уже не убрать.',use:['pH-нейтральное средство для камня','Средство для ежедневного ухода за камнем','Мягкая микрофибра и тёплая вода'],never:['Уксус, лимон, лимонная кислота','Средства от налёта и для WC (кислотные)','Абразивный порошок и металлическая губка','Хлорсодержащие средства'],how:['Сначала удалите пыль и частицы насухо: песок царапает камень','Протрите разведённым pH-нейтральным средством для камня','Смойте чистой водой и сразу вытрите микрофиброй']},
{n:'Травертин',sub:'Пористый кальцитовый камень',lt:'Высокая чувствительность',d:'Как и мрамор, реагирует на кислоту, а в порах скапливаются грязь и вода. Излишняя жидкость оставляет пятна.',use:['pH-нейтральное средство для камня','Мягкая щётка для пор','Хорошо отжатая микрофибра'],never:['Уксус, лимон и любая кислота','Средства от известкового налёта','Абразивный порошок','Чистка паром незаполненных пор'],how:['Удалите пыль сухой шваброй или пылесосом','Протрите разведённым нейтральным средством, поры мягкой щёткой','Смойте небольшим количеством воды и сразу высушите']},
{n:'Известняк',sub:'Осадочный кальцитовый камень',lt:'Высокая чувствительность',d:'Самый мягкий и впитывающий камень в этом списке. Кислота повреждает его за секунды, а масло и вино проникают глубоко.',use:['pH-нейтральное средство для камня','Быстро промокнуть пятно бумажным полотенцем','Микрофибра и тёплая вода'],never:['Любая кислота, в том числе «натуральный» уксус','Средства с хлором и аммиаком','Металлическая губка и порошок'],how:['Сразу промокните пятно: прижмите, не растирайте','Протрите нейтральным средством для камня','Высушите и сообщите менеджеру, если остался след']},
{n:'Гранит',sub:'Силикатный камень',lt:'Средняя чувствительность',d:'Твёрдый камень, относительно устойчивый к кислоте, но его защитный слой (силер) стирается кислотными и сильнощелочными средствами.',use:['pH-нейтральное средство для камня ежедневно','От налёта: специальное средство, допустимое для камня','Микрофибра'],never:['Сильная кислота или щёлочь ежедневно','Абразивный порошок на полированной поверхности','Масляные спреи «для блеска»'],how:['Удалите частицы насухо','Протрите нейтральным средством','Средство от налёта сначала попробуйте на незаметном участке']},
{n:'Базальт',sub:'Вулканический камень',lt:'Средняя чувствительность',d:'Плотный вулканический камень, выдерживает кислотное средство для плитки при правильном разведении. Слабое место: швы.',use:['Ежедневно: нейтральное средство','От налёта: кислотное средство для плитки в правильном разведении','Предварительно смочить швы водой'],never:['Неразведённая кислота','Бытовое средство от налёта неизвестного состава','Оставлять кислоту на поверхности без смывания'],how:['Смочите швы и поверхность чистой водой','Нанесите разведённое средство и выдержите время, указанное на этикетке','Обильно смойте и высушите']},
{n:'Керамика / фаянс',sub:'Глазурованная плитка, раковина, унитаз',lt:'Низкая чувствительность',d:'Самая устойчивая к химии поверхность. Бережно обращайтесь со швами и глазурью: абразив убирает блеск.',use:['От жира: щелочное средство','От налёта: кислотное средство (швы заранее смочите)','В санузле: дезинфицирующее средство'],never:['Хлор и кислоту вместе или друг за другом','Абразивный порошок на глазури','Металлическая губка'],how:['Нанесите средство сверху вниз','Выдержите время действия','Смойте и вытрите насухо: не оставляйте водяных пятен']},
{n:'Нержавеющая сталь',sub:'Смесители, перила, техника',lt:'Средняя чувствительность',d:'Хлор и соляная кислота разрушают защитный слой стали и оставляют точки ржавчины, особенно в морском воздухе.',use:['Нейтральное или специальное средство для стали','Микрофибра по направлению волокон','Периодически защитное средство'],never:['Хлорсодержащие средства','Металлическая губка и порошок','Средства с соляной кислотой'],how:['Протрите нейтральным средством по направлению волокон','Смойте чистой водой','Отполируйте сухой микрофиброй']},
{n:'Дерево / мебель',sub:'Лакированное или обработанное маслом',lt:'Высокая чувствительность',d:'Дереву больше всего вредят лишняя вода и универсальный спрей: лак белеет и вздувается.',use:['Нейтральное средство для дерева','Хорошо отжатая микрофибра','Периодически масло для ухода или полироль'],never:['Мокрая тряпка и лишняя вода','Аммиачные и универсальные спреи','Пар и абразив'],how:['Удалите пыль сухой микрофиброй','Средство наносите на салфетку, а не на поверхность','Сразу вытрите насухо']},
{n:'Стекло / зеркало',sub:'Окна, зеркала, стеклянные столы',lt:'Низкая чувствительность',d:'Стекло устойчиво, но жидкость, стекающая к краям зеркала, повреждает амальгаму и оставляет чёрные пятна.',use:['Средство для стекла (на спиртовой основе)','Микрофибра для стекла','Сгон для больших поверхностей'],never:['Абразивный порошок и зелёный пад','Распыление средства прямо на край зеркала','Жирная тряпка'],how:['Нанесите средство на салфетку','Протрите сверху вниз S-образными движениями','Отполируйте сухой микрофиброй без разводов']}
],
MECH:[
{n:'Стекло / зеркало',ct:'Синяя салфетка',tool:'Микрофибра для стекла и сгон',tech:'Нанесите средство на салфетку, протрите сверху вниз, в конце отполируйте сухой микрофиброй.',ex:'Зеркало в ванной: следы пара влажной микрофиброй для стекла, затем сухой, без разводов.',w:'Пад скрабера или металлическая губка: на стекле остаются царапины.'},
{n:'Полированный камень',ct:'Синяя салфетка',tool:'Мягкая микрофибра; при необходимости только белый пад',tech:'Сначала насухо удалите песок и пыль, затем влажная салфетка, в конце сразу высушите.',ex:'Мраморный стол: след от чашки влажной микрофиброй и нейтральным средством, без трения.',w:'Зелёный или чёрный пад, металлическая губка: блеск теряется навсегда.'},
{n:'Плитка и швы',ct:'Жёлтая салфетка',tool:'Скрабер с синим падом; узкая щётка для швов',tech:'Плитку скрабером, шов узкой щёткой вдоль шва; в конце смыть и высушить.',ex:'Плитка в душе: налёт синим падом и средством для плитки, швы заранее смочены.',w:'Зелёный или чёрный пад на глазурованной плитке: блеск пропадает, грязь налипает быстрее.'},
{n:'Сантехника (унитаз)',ct:'Красная салфетка',tool:'Ёршик и красная салфетка, только для этой зоны',tech:'Смойте, нанесите средство под ободок, выдержите время действия, почистите ёршиком; снаружи сверху вниз красной салфеткой.',ex:'Налёт под ободком: средство на 5-10 минут, затем ёршик без усилия.',w:'Красная салфетка или перчатки в другой зоне: главная причина переноса инфекции.'},
{n:'Деревянная мебель',ct:'Синяя салфетка',tool:'Мягкая микрофибра; сухая салфетка для пыли',tech:'Сначала насухо удалите пыль, затем хорошо отжатая салфетка по направлению волокон и сразу высушить.',ex:'Прикроватная тумба: след от стакана влажной микрофиброй и средством для дерева, без трения.',w:'Мокрая тряпка и любой пад: лак белеет и стирается.'},
{n:'Ковёр / ткань',ct:'Белая салфетка',tool:'Пылесос, белая хлопковая салфетка, пятновыводитель для ткани',tech:'Промокайте пятно от края к центру: не растирайте. В конце соберите влагу сухой салфеткой.',ex:'Пятно от кофе: холодная вода и средство для ткани, промокание от края к центру.',w:'Трение и горячая вода: пятно проникает глубоко в волокна и закрепляется.'},
{n:'Твёрдый пол',ct:'Плоская швабра',tool:'Плоская швабра и ведро с двумя отсеками',tech:'Сначала пыль, затем швабра восьмёркой от дальнего угла к двери; чистая и грязная вода в разных отсеках.',ex:'Каменный пол в лобби: до 8 утра, с нейтральным средством и хорошо отжатой шваброй.',w:'Одно ведро для чистой и грязной воды: грязь расходится по всему полу.'}
],
DEP:[
['Вход и проветривание',,'Мировой стандарт','Постучите, представьтесь, сообщите, что ведётся видеонаблюдение (если оно есть), и войдите. Включите свет, откройте окно и проверьте, нет ли повреждений или забытых вещей.'],
['Мусор и использованное бельё',,'Мировой стандарт','Вынесите мусор из всех корзин, снимите бельё и полотенца и сразу положите в мешок. Не кладите их на пол.'],
['Нанесение средства в ванной',,'Стандарт объекта','Нанесите средство на унитаз, раковину и душ, чтобы оно подействовало, пока вы убираете комнату.'],
['Пыль: сверху вниз',,'Мировой стандарт','Удаляйте пыль с самых высоких поверхностей вниз, по часовой стрелке, синей салфеткой.'],
['Заправка кровати',,'Стандарт объекта','Расстелите чистое бельё, углы заправьте «конвертом», подушки разложите по схеме отеля.'],
['Уборка ванной',,'Совет менеджера','По цветовому коду: жёлтый для раковины и душа, красный для унитаза. В конце отполируйте зеркало и смесители.'],
['Амениты и полотенца',,'Стандарт объекта','Пополните мыло, шампунь, туалетную бумагу и повесьте чистые полотенца по стандартной схеме.'],
['Пол и финальная проверка',,'Мировой стандарт','Пылесос или швабра от дальнего угла к двери. В конце посмотрите на номер от двери глазами гостя.']
],
STAY:[
['Проверка знака на двери',,'Мировой стандарт','Если висит «Не беспокоить», не входите и отметьте это в приложении. В остальных случаях постучите и представьтесь.'],
['Мусор и посуда',,'Мировой стандарт','Опустошите корзины, вынесите использованные стаканы и посуду. Не трогайте и не перекладывайте вещи гостя.'],
['Поправить кровать',,'Стандарт объекта','Поправьте бельё; меняйте его только по просьбе гостя или по графику отеля.'],
['Быстрая уборка ванной',,'Стандарт объекта','Раковина, душ и унитаз по цветовому коду; замените полотенца, брошенные на пол.'],
['Пополнение аменитов',,'Стандарт объекта','Пополните то, что израсходовано: вода, кофе, мыло, туалетная бумага.'],
['Пол и проверка',,'Мировой стандарт','Пропылесосьте свободные зоны. В конце проверьте окно, свет и кондиционер.']
],
SAN:[
['Гигиена рук',['Мойте руки перед сменой, после каждого номера и после уборки санузла','С мылом, не меньше 20-30 секунд','Мойте руки и после снятия перчаток'],'Перчатки не заменяют мытьё рук.'],
['Перчатки',['Отдельная пара для санузла и отдельная для комнаты','Повреждённые перчатки сразу замените','В перчатках не трогайте ручки, телефон и чистое бельё'],'Перчатки красной зоны не выходят в другую зону.'],
['Безопасное хранение химии',['У каждой бутылки должна быть этикетка: бутылку без названия не используйте','Не переливайте химию в бутылки из-под напитков','На тележке кислота и хлор в разных отделениях'],'Паспорт безопасности (SDS) всегда должен быть доступен.'],
['Перекрёстное загрязнение',['Цветовой код: красный для унитаза, жёлтый для раковины и душа, синий для поверхностей, зелёный для еды','Убирайте от чистого к грязному','Стаканы и мини-бар отдельной салфеткой'],'Одна салфетка, одна зона.'],
['Кровь и биологические отходы',['Наденьте одноразовые перчатки','Сначала соберите впитывающей салфеткой, затем дезинфекция','Отходы в отдельный закрытый пакет; сообщите менеджеру'],'Не трогайте иглу или острый предмет руками: вызовите менеджера.'],
['Дезинфекция и проветривание',['Дезинфицирующему средству нужно время действия: смотрите этикетку','Сначала очистите, затем дезинфицируйте: на грязи средство не действует','При работе с химией окно или вентиляция должны быть включены'],'Берегите глаза от брызг: распыляйте на салфетку.']
],
CASES:[
{src:'[Региональный отель · Имерети]',tag:'Камень · мрамор',t:'Мраморный пол в лобби и средство от налёта',what:'Несколько недель пол мыли средством от налёта (кислотным). Появились матовые полосы, блеск пропал.',fix:'Профессиональная полировка, затем только pH-нейтральное средство для камня.',les:'Отдельная бутылка с цветной маркировкой для камня в лобби: ошибка больше не повторялась.',res:'Ущерб сведён к минимуму'},
{src:'[Семейный отель · Кахети]',tag:'Мебель · дерево',t:'Деревянные столы ресторана и универсальный спрей',what:'Столы каждый день протирали универсальным бытовым спреем и мокрой тряпкой. Лак исчез, остались белые пятна от капель.',fix:'Нейтральное средство для дерева, хорошо отжатая микрофибра и периодически масло для ухода.',les:'С деревом «чем меньше воды, тем лучше». Повреждённые столы спасли на раннем этапе.',res:'Ущерба удалось избежать'},
{src:'[Отель · Аджария]',tag:'Металл · сталь',t:'Перила у моря и хлор',what:'Перила из нержавеющей стали мыли хлорсодержащим средством. Появились точки ржавчины.',fix:'Специальное средство для стали и защитное средство; хлор на металле запретили.',les:'Морской воздух + хлор = быстрая коррозия. Уход за сталью раз в месяц.',res:'Ущерб сведён к минимуму'},
{src:'[Бутик-отель · Самегрело]',tag:'Камень · базальт',t:'Базальтовая ванная и известковый налёт',what:'Налёт на стене душа не удавалось убрать бытовой химией: много времени и затрат, а результата нет.',fix:'Кислотное средство для плитки в правильном разведении, швы заранее смочены, обильное смывание.',les:'Правильная профессиональная химия за одну смену сделала то, с чем бытовая не справлялась неделями.',res:'Сэкономлены время и деньги'}
],
DMG:[
{n:'Матовое пятно на камне',s:'Мрамор, травертин',b:'Лёгкое: сами · глубокое: специалист',why:'Кислота (лимон, вино, уксус, средство от налёта) растворила поверхность камня: это не пятно, а повреждение поверхности.',st:['Прекратите использовать это средство и смойте место чистой водой','Высушите и сфотографируйте','Сообщите менеджеру: не пытайтесь «исправить» другой химией'],w:'Покрытие воском или полиролью скрывает проблему и усложняет восстановление.',ex:'Для лёгкого поверхностного пятна: порошок или паста для полировки мрамора, силами обученного сотрудника. При глубоком повреждении: повторная обработка и полировка специалистом.',pr:'Паста / порошок для полировки мрамора (лёгкое повреждение)'},
{n:'Потеря цвета / выцветание',s:'Камень, швы',b:'Часто: специалист',why:'Хлор или сильная щёлочь разрушили пигмент камня или шва, либо в порах остались остатки средства.',st:['Прекратите использовать средство и обильно смойте место','Высушите и сфотографируйте при дневном свете','Сообщите менеджеру: не «восстанавливайте» цвет другой химией'],w:'Краска или маркер на шве потом усложняют профессиональное восстановление.',ex:'На камне: глубокая чистка и при необходимости повторная полировка; на шве: очистка или замена шва и нанесение защитного слоя.',pr:'Восстановитель швов / средство глубокой очистки пор камня'},
{n:'Царапина',s:'Полированный камень, сталь',b:'Лёгкая: сами · глубокая: специалист',why:'Песок, абразивный пад или металлическая губка поцарапали поверхность.',st:['Насухо удалите с поверхности песок и частицы','Не «затирайте» царапину: это её расширяет','Сфотографируйте при боковом свете и сообщите менеджеру'],w:'«Исправлять» царапину на стали металлической губкой: появятся новые царапины.',ex:'На камне: поэтапная полировка алмазными дисками; на стали: специальной губкой по направлению волокон, силами опытного сотрудника.',pr:'Диски для полировки камня / набор для восстановления стали'},
{n:'Белый след на дереве',s:'Лакированная мебель',b:'Часто: сами',why:'Горячий стакан или вода оставили влагу в слое лака: это поверхностный след, дерево обычно не повреждено.',st:['Сразу высушите место мягкой салфеткой','Не используйте воду и универсальный спрей','Сфотографируйте и сообщите менеджеру'],w:'Зубная паста, горячий утюг и «народные» советы вредят лаку ещё больше.',ex:'При лёгком следе: средство для ухода за деревом или специальный удалитель следов; при глубоком: обновление слоя лака мастером.',pr:'Восстановитель деревянной мебели / полироль'},
{n:'Точки ржавчины',s:'Нержавеющая сталь',b:'На раннем этапе: сами',why:'Хлор или соль (морской воздух) разрушили защитный слой стали.',st:['Сразу уберите хлорсодержащее средство из этой зоны','Протрите нейтральным средством, смойте и высушите','Сфотографируйте и сообщите менеджеру'],w:'Удалять ржавчину металлической губкой: частицы стали застревают, и ржавчина возвращается быстрее.',ex:'Средство для пассивации стали или мягкий удалитель ржавчины, затем защитный слой; в приморской зоне уход раз в месяц.',pr:'Очиститель и защита для нержавеющей стали'}
],
HH:[
{n:'Нет средства для камня',pro:'pH-нейтральное средство для камня',sub:'Нейтральное средство для посуды: несколько капель на 1 литр тёплой воды. Без ароматизаторов, лимона и «антибактериальных» добавок.',ok:'Мрамор, травертин, известняк, гранит, базальт: ежедневная уборка и свежие пятна',no:['Уксус, лимон, лимонная кислота','«Универсальный» спрей, если на этикетке указаны кислота или хлор','Зелёная сторона кухонной губки'],st:['Сначала промокните пятно бумажным полотенцем: прижмите, не растирайте','Протрите микрофиброй, смоченной в растворе и хорошо отжатой','Смойте чистой водой и сразу высушите: лишнее мыло оставляет плёнку'],risk:'Низкий, если жидкость действительно нейтральная и вы хорошо смыли.'},
{n:'Нет средства для стекла',pro:'Средство для стекла на спиртовой основе',sub:'70% спирт, смешанный с водой 1:1; или тёплая вода с одной каплей средства для посуды.',ok:'Зеркала, окна, стеклянные столы, стекло душа',no:['Раствор уксуса, если ниже каменный подоконник или полка: капли повреждают камень','Распыление средства прямо на край зеркала','Бумажное полотенце: оставляет ворс'],st:['Нанесите раствор на салфетку, а не на зеркало','Протрите сверху вниз','Отполируйте сухой микрофиброй для стекла'],risk:'Низкий. Не используйте спирт на лакированном или плёночном стекле.'},
{n:'Нет средства от налёта',pro:'Кислотное средство для плитки / сантехники',sub:'Лимонная кислота: 1 столовая ложка на 0,5 литра тёплой воды, или бытовое средство от налёта по этикетке.',ok:'Глазурованная керамика, фаянс, хромированные смесители, стекло душа',no:['Мрамор, травертин, известняк: даже одна капля оставляет матовое пятно','После хлорсодержащего средства или вместе с ним: ядовитый газ','Базальтовая или гранитная плитка без согласия менеджера'],st:['Сначала смочите швы и соседнюю поверхность чистой водой','Нанесите раствор, подождите 3-5 минут, потрите синим или белым падом','Обильно смойте: не оставляйте кислоту на поверхности'],risk:'Средний. Кислота чаще всего повреждает камень: сначала убедитесь, что поверхность не каменная.'},
{n:'Нет средства от жира',pro:'Щелочное профессиональное средство от жира',sub:'Горячая вода и средство для посуды; для пригоревшего жира паста из пищевой соды (сода + немного воды).',ok:'Мини-бар, кухонная плитка, стальные поверхности, керамика',no:['Паста из соды на полированном камне и лакированном дереве: слегка царапает','«Пар + химия» на дереве','Спрей для духовки на алюминии и снаружи стали'],st:['Сначала соберите жир бумагой','Протрите горячей водой с мылом; содовую пасту мягкими движениями','Смойте и вытрите зелёной салфеткой'],risk:'Низкий при аккуратном использовании соды.'},
{n:'Нет дезинфицирующего средства',pro:'Сертифицированное дезинфицирующее средство',sub:'Бытовой хлор (гипохлорит) в разведении по этикетке, в холодной воде; на небольших поверхностях 70% спирт.',ok:'Унитаз, раковина, плитка душа (хлор); ручки, пульт, выключатели (спирт)',no:['Вместе с кислотой, средством от налёта или аммиаком: ядовитый газ','На нержавеющей стали, камне и ткани','В закрытом помещении без вентиляции'],st:['Сначала обычным способом очистите поверхность: на грязи дезинфекция не действует','Нанесите раствор и оставьте на время, указанное на этикетке','Смойте, откройте окно, перчатки обязательны'],risk:'Высокий, если нарушено правило смешивания. В одном ведре только одно средство.'},
{n:'Нет средства для дерева',pro:'Нейтральное средство для дерева / средство ухода',sub:'Слегка влажная микрофибра; при необходимости одна капля средства для посуды на стакан воды.',ok:'Лакированная или промасленная мебель, двери, прикроватные тумбы',no:['Универсальные и кухонные спреи','Уксус и масляные «домашние рецепты» на лакированной поверхности','Мокрая тряпка и пар'],st:['Сначала насухо удалите пыль','Протрите хорошо отжатой салфеткой по направлению волокон','Сразу вытрите сухой салфеткой'],risk:'Низкий, если воды минимум.'},
{n:'Нет средства для стали',pro:'Средство для нержавеющей стали и защита',sub:'Тёплая вода со средством для посуды; для следов пальцев 70% спирт.',ok:'Смесители, перила, двери холодильника и лифта',no:['Хлор и хлорсодержащие кремы','Металлическая губка, порошок','WC-средство с соляной кислотой'],st:['Протирайте по направлению волокон','Смойте чистой водой','Отполируйте сухой микрофиброй'],risk:'Низкий.'},
{n:'Нет пятновыводителя для ткани',pro:'Пятновыводитель для ткани и ковров',sub:'Холодная вода и несколько капель средства для посуды; на жирное пятно пищевая сода на 15 минут, затем пылесос.',ok:'Ковры, шторы, обивка кресел',no:['Горячая вода на вино, кровь и кофе: пятно закрепляется','Хлор и перекись водорода на цветной ткани','Трение: волокно повреждается, пятно расползается'],st:['Промокайте пятно белой салфеткой от края к центру','Сначала попробуйте раствор на незаметном участке','В конце соберите влагу чистой водой и сухой салфеткой'],risk:'Средний: цветную ткань всегда проверяйте сначала.'}
],
LABEL:[
['Кислота, лимонная кислота, уксусная кислота, «против налёта»','Кислота','Мрамор, травертин, известняк, швы'],
['Гипохлорит, хлор, «отбеливатель»','Хлор','Сталь, камень, цветная ткань; смешивание с кислотой и аммиаком'],
['Аммиак, нашатырь','Аммиак','Дерево, смешивание с хлором'],
['Абразивный, порошок, «скраб»','Царапает','Полированный камень, стекло, сталь, лакированное дерево'],
['Нейтральный, pH 7, «деликатный»','Нейтральное','Самое безопасное: обычно везде']
],
HCASES:[
[,'[Отель · Тбилиси]','Закончилось средство для камня: мрамор в лобби','Во время ночной смены на пол лобби пролили кофе. Горничная использовала слабый раствор нейтрального средства для посуды, смыла и высушила, а утром попросила у менеджера профессиональное средство.','Ущерба не было: правильное временное решение.'],
[,'[Семейный отель · Мцхета]','Зеркало, вымытое уксусом, и мраморная полка','Вместо средства для стекла зеркало вымыли раствором уксуса. Раствор стёк на мраморную полку ниже и оставил матовые точки.','Выбирая бытовую химию, смотрите не только на поверхность, но и на то, куда она будет капать.'],
[,'[Отель · Боржоми]','Хлорный гель и кислотное WC-средство подряд','На унитаз сначала нанесли хлорный гель, затем кислотное средство от налёта без смывания. В номере появился резкий запах, у сотрудницы закружилась голова.','Между двумя средствами: смыть и проветрить. Лучше всего одно средство за смену.'],
[,'[Гостевой дом · Сигнахи]','Без средства от жира: мини-бар','На стальной полке мини-бара был жир. Использовали горячую воду, средство для посуды и мягкую пасту из соды, по направлению волокон.','Эффективно и безопасно, без царапин.']
],
TROLLEY:[['Микрофибра 4 цветов (каждого 5+)'],['Микрофибра для стекла и сгон'],['Скрабер с белым и синим падом'],['Узкая щётка для швов'],['Ёршик для унитаза'],['Плоская швабра и ведро с двумя отсеками'],['Бутылки-дозаторы с этикеткой'],['Перчатки']],
QUIZ:[
{q:'На мраморный пол в лобби пролили кофе. У вас есть: а) средство от налёта с лимонной кислотой, б) pH-нейтральное средство для камня, в) хлорный гель. Что выберете?',o:['Средство от налёта с лимонной кислотой','pH-нейтральное средство для камня','Хлорный гель'],e:'Мрамор это кальцитовый камень: кислота его растворяет и оставляет матовое пятно, а хлор портит цвет. Правильно: нейтральное средство, промакивая пятно.'},
{q:'Вы нанесли на унитаз хлорный гель. Теперь хотите убрать налёт кислотным WC-средством. Что сделаете?',o:['Сразу нанесу и кислоту','Сначала смою, проветрю, а второе средство лучше использовать в другой раз','Смешаю оба в одном ведре'],e:'Хлор + кислота образуют хлорный газ. Между двумя средствами: смыть и проветрить, в идеале в другое время.'},
{q:'На полированном гранитном столе засохшее пятно. Какой пад возьмёте?',o:['Зелёный','Чёрный','Белый'],e:'На полированном камне только белый (мягкий) пад. Зелёный и чёрный убирают блеск навсегда.'},
{q:'На стальных перилах приморского отеля пятна. Какое средство использовать нельзя?',o:['Нейтральное средство','Хлорсодержащее средство','Специальное средство для стали'],e:'Хлор разрушает защитный слой стали: вместе с морским воздухом быстро появляются точки ржавчины.'},
{q:'Закончилось средство для стекла. Под зеркалом мраморная полка. Что используете?',o:['Раствор уксуса','Спирт, смешанный с водой 1:1, нанесённый на салфетку','Универсальный кухонный спрей'],e:'Капля уксуса повредит мраморную полку. Спиртовой раствор наносите на салфетку, а не на зеркало.'}
],
DEEP:[
['Полировка мрамора в лобби',,'Мрамор · белый пад, нейтральное средство'],
['Глубокая чистка швов в душе (6 номеров)',,'Базальтовая плитка · щётка для швов'],
['Глубокая чистка ковра в коридоре',,'Ковёр · средство для ткани'],
['Переворот матрасов (8 номеров)',,'Стандарт · 2 человека'],
['Уход за деревянной мебелью маслом (ресторан)',,'Дерево · масло для ухода'],
['Защитный слой на стальных перилах',,'Нержавеющая сталь · раз в месяц'],
['Пыль со штор и жалюзи',,'Ткань · пылесос'],
['Глубокая чистка мини-баров (10 номеров)',,'Зелёная салфетка · зона питания']
],
STAFF:[['НБ','Нино Б.'],['ЛМ','Лия М.'],['ТК','Тамар К.'],['МД','Мариам Д.']],
WD:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
WDF:['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'],
MON:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
AI:[
['бытов|нет средств|нет проф|закончил','Если нет профессионального средства: сначала сообщите менеджеру. На камне временно подойдёт слабый раствор нейтрального средства для посуды, затем смыть и высушить. Кислоту (уксус, лимон) на камне никогда. Подробнее на странице «Бытовая химия».'],
['базальт','Базальт это плотный камень. Ежедневно: нейтральное средство. От налёта: кислотное средство для плитки в правильном разведении. Сначала смочите швы водой, в конце обильно смойте.'],
['налёт|налет|извест|накип','При налёте сначала определите поверхность. На граните: специальное средство, допустимое для камня, сначала на незаметном участке. На базальте и керамической плитке: кислотное средство для плитки в правильном разведении. На мраморе и травертине кислоту никогда.'],
['вин|кофе|пятн','Органическое пятно (вино, кофе) сразу промокните бумажным полотенцем: прижмите, не растирайте. На мраморе только pH-нейтральное средство для камня. Лучше сначала сделать фотопроверку.'],
['мрамор|травертин|известняк','Мрамор реагирует на кислоту. Используйте только pH-нейтральное средство для камня и мягкую микрофибру. Если осталось матовое пятно, это повреждение: сообщите менеджеру.'],
['хлор.*стал|стал.*хлор','Нет. Хлор оставляет на нержавеющей стали точки ржавчины. Используйте нейтральное или специальное средство для стали, по направлению волокон.'],
['стал|смесител|ржав','На нержавеющей стали хлор запрещён. Используйте нейтральное или специальное средство для стали, по направлению волокон, в конце сухая микрофибра.'],
['дерев|мебел|стакан','С деревом чем меньше воды, тем лучше. Средство наносите на салфетку, протирайте по направлению волокон и сразу высушите.'],
['хлор|смеш','Никогда не смешивайте хлор с кислотой (хлорный газ) или аммиаком (ядовитый газ). Если кружится голова, выйдите из комнаты, откройте окно и сообщите менеджеру.'],
['поврежд','Прекратите использовать средство, смойте чистой водой, сфотографируйте и сообщите менеджеру. Подробнее на странице «Восстановление повреждённой поверхности».']
],
EXAMPLE:{surface:'Мрамор (кальцитовый камень), полированный',stain:'Пятно от вина: органическое, кислое',product:'Средство от налёта ANTI-KALK',active:'Кислота (лимонная кислота 10%)',reason:'Лимонная кислота растворяет поверхность мрамора: пятно от вина может сойти, но останется матовое пятно, которое убирает только полировка.',manager:'Номер 204: кислотное средство не использовать.',instead:'pH-нейтральное средство для камня и мягкая микрофибра; если его нет, слабый раствор нейтрального средства для посуды.',steps:['Промокните пятно бумажным полотенцем: прижмите, не растирайте','Протрите разведённым нейтральным средством','Смойте чистой водой и сразу высушите']}
};


/* ---------- 4. Language + theme ---------- */
const LANGS=['ka','en','ru'];
const HTML_LANG={ka:'ka',en:'en',ru:'ru'};
let LANG=(()=>{const s=store.get(LS_LANG);return LANGS.includes(s)?s:'ka'})();

/* Georgian text that lives in index.html is collected once, so the page can switch back to Georgian */
function harvestGeorgian(){
  /* Georgian text edited in index.html wins over the built-in copy.
     If the same text appears twice, the edited copy is used everywhere. */
  const edited={};
  $$('[data-i18n]').forEach(el=>{const k=el.dataset.i18n,v=el.innerHTML.trim();if(!S[k])return;
    if(S[k][0]==null)S[k][0]=v;else if(v!==S[k][0]&&!(k in edited))edited[k]=v});
  Object.keys(edited).forEach(k=>{S[k][0]=edited[k]});
  $$('[data-i18n-aria]').forEach(el=>{const k=el.dataset.i18nAria;if(S[k])S[k][0]=el.getAttribute('aria-label')});
}

/* Translate a key. Falls back to Georgian, then to the key itself. */
function t(key){
  const e=S[key];
  if(!e)return key;
  const v=e[LANGS.indexOf(LANG)];
  return v==null?(e[0]==null?key:e[0]):v;
}

/* Merge translated content over the Georgian base (missing values keep the Georgian one, e.g. numbers) */
function merge(a,b){
  if(b===undefined||b===null)return a;
  if(Array.isArray(a)&&Array.isArray(b))return a.map((x,i)=>merge(x,b[i]));
  if(a&&b&&typeof a==='object'&&typeof b==='object'){const o=Object.assign({},a);Object.keys(b).forEach(k=>{o[k]=merge(a[k],b[k])});return o}
  return b;
}
const DCACHE={};
function D(){return DCACHE[LANG]||(DCACHE[LANG]=LANG==='ka'?DATA.ka:merge(DATA.ka,DATA[LANG]))}

/* Apply the language to the static HTML */
function applyStatic(){
  document.documentElement.lang=HTML_LANG[LANG];
  $$('[data-i18n]').forEach(el=>{el.innerHTML=t(el.dataset.i18n)});
  $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
  $$('[data-lang]').forEach(b=>{const on=b.dataset.lang===LANG;b.classList.toggle('on',on);b.setAttribute(b.getAttribute('role')==='menuitemradio'?'aria-checked':'aria-pressed',on)});
}
function setLang(l){
  if(!LANGS.includes(l)||l===LANG)return;
  LANG=l;store.set(LS_LANG,l);
  applyStatic();renderShared();route();
}

/* Theme: the design is dark; light is an added option. Saved per browser. */
function setTheme(th,animate){
  const root=document.documentElement;
  /* Smooth color change only when the user switches, not on page load */
  if(animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){root.classList.add('theming');clearTimeout(setTheme.tm);setTheme.tm=setTimeout(()=>root.classList.remove('theming'),450)}
  root.setAttribute('data-theme',th);
  store.set(LS_THEME,th);
  const m=$('meta[name="theme-color"]');if(m)m.content=th==='light'?'#ffffff':'#0b0b0c';
  $$('[data-theme-pick]').forEach(b=>b.classList.toggle('on',b.dataset.themePick===th));
}
const theme=()=>document.documentElement.getAttribute('data-theme')==='light'?'light':'dark';

/* Toast message */
let toastTimer;
function toast(msg){
  const host=$('#toastHost');if(!host)return;
  host.innerHTML='<div class="toast" role="status">'+esc(msg)+'</div>';
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>{host.innerHTML=''},2600);
}

/* ---------- 5. Schedule model (14 days, built from booking numbers) ---------- */
const DEP0=[9,6,4,7,14,18,22], STAY0=[17,14,12,15,18,20,16], DELTA2=[0,-2,-1,-3,1,2,3];
const CAP=420, T_DEP=31, T_STAY=18, T_PUB=60, ME=1;
const ROOMS=[];[1,2,3,4].forEach(f=>{for(let r=1;r<=10;r++)ROOMS.push(f*100+r)});
const T0=new Date();T0.setHours(0,0,0,0);
const DAYS=Array.from({length:14},(_,i)=>{
  const d=new Date(T0);d.setDate(T0.getDate()+i);const w=(d.getDay()+6)%7;
  const dep=Math.max(2,DEP0[w]+(i>=7?DELTA2[w]:0)),stay=STAY0[w];
  const staff=DATA.ka.STAFF.map((s,j)=>j).filter(j=>DATA.ka.STAFF[j][2][w]);
  const need=dep*T_DEP+stay*T_STAY+T_PUB,cap=staff.length*CAP,load=Math.round(need/cap*100);
  const lvl=load<56?'low':load>=80?'high':'mid';
  return {i,d,w,dep,stay,arr:Math.max(1,Math.round(dep*.9)),staff,need,cap,load,lvl,free:Math.max(0,Math.round(cap*.9-need)),sugg:[],plan:[]};
});
/* Suggest deep-cleaning tasks for quiet days, most overdue first */
(function planDeep(){
  const DEEP=DATA.ka.DEEP;
  const order=DEEP.map((x,k)=>k).sort((a,b)=>DEEP[b][4]/DEEP[b][3]-DEEP[a][4]/DEEP[a][3]);
  const used=new Set();let first=true;
  DAYS.filter(d=>d.lvl==='low').forEach(d=>{let left=d.free;
    order.forEach(k=>{if(d.sugg.length<3&&!used.has(k)&&DEEP[k][1]<=left){d.sugg.push(k);used.add(k);left-=DEEP[k][1]}});
    if(first&&d.sugg.length){d.plan.push(d.sugg.shift());first=false}});
  DAYS.filter(d=>d.lvl==='mid').forEach(d=>{const k=order.find(k=>!used.has(k)&&DEEP[k][1]<=45);if(k!=null&&d.free>=45){d.sugg.push(k);used.add(k)}});
})();
const fmtM=m=>{m=Math.max(0,Math.round(m));const h=Math.floor(m/60),r=m%60;return ((h?h+' '+t('u.h')+' ':'')+(r||!h?r+' '+t('u.min'):'')).trim()};
const dLabel=d=>(d.i===0?t('d.today'):d.i===1?t('d.tomorrow'):D().WDF[d.w])+', '+d.d.getDate()+' '+D().MON[d.d.getMonth()];
const LVB={low:'lo',mid:'mid',high:'hi'};
const lvBadge=d=>'<span class="badge '+LVB[d.lvl]+'">'+t('lv.'+d.lvl)+' · '+d.load+'%</span>';
const staffName=j=>D().STAFF[j][1];
const myShare=d=>{const n=d.staff.length,dep=Math.ceil(d.dep/n),stay=Math.ceil(d.stay/n);return {dep,stay,min:dep*T_DEP+stay*T_STAY+Math.round(T_PUB/n)}};
const myRooms=(d,dep,stay)=>{const off=(d.i*7+ME*11)%ROOMS.length,r=[];for(let k=0;k<dep+stay;k++)r.push(ROOMS[(off+k*3)%ROOMS.length]);return {dep:r.slice(0,dep),stay:r.slice(dep)}};


/* ---------- 6. Views ---------- */
/* Shared building blocks */
const hdr=(key,n)=>'<div class="top">'+B('data-go="back" aria-label="'+esc(t('back'))+'"',ic('back'),'back')+'<div class="top-t">'+t(key)+'</div>'+(n?'<div class="top-n">'+n+'</div>':'')+'</div>';
const HK_TABS=[['dashboard','tab.home','home'],['photo','tab.photo','camera'],['chem','tab.chem','flask'],['sched','tab.sched','cal'],['profile','tab.profile','user']];
const MG_TABS=[['manager','tab.home','home'],['mschedule','tab.sched','cal'],['msend','tab.send','send'],['standards','tab.standards','list']];
const tabbar=(items,act)=>'<nav class="tabbar" aria-label="App">'+items.map(([id,k,i])=>A(id,ic(i)+'<span>'+t(k)+'</span>','tb'+(id===act?' on':''),id===act?'aria-current="page"':'')).join('')+'</nav>';
const scr=(body,after)=>'<section class="scr"><div class="scr-body">'+body+'</div>'+(after||'')+'</section>';
const dots=(arr,c)=>'<ul class="dots'+(c?' '+c:'')+'">'+arr.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
const steps=arr=>'<div class="stepsl">'+arr.map((x,i)=>'<div class="step-row"><span class="sn">'+(i+1)+'</span><p>'+x+'</p></div>').join('')+'</div>';
const chip=(txt,on,attr)=>B(attr||'data-pick','<span>'+txt+'</span>','chip'+(on?' on':''));
/* Video card: opens the training video on YouTube in a new tab (change VIDEO_URL to use another video) */
const VIDEO_URL='https://www.youtube.com/watch?v=ggZ8QxMN8Uw';
const video=(k,s,q)=>'<a class="vid" target="_blank" rel="noopener" href="'+VIDEO_URL+'"><span class="pl">'+ic('play')+'</span><div><b>'+t(k)+'</b><div class="mut sm">'+t(s)+'</div></div></a>';
const phScale=(a,b)=>'<div class="ph"><div class="ph-h"><span>'+t('chem.ph')+'</span><b>'+a+'-'+b+'</b></div><div class="ph-bar">'+Array.from({length:15},(_,i)=>'<i class="'+(i>=a&&i<=b?'on':'')+'"></i>').join('')+'</div><div class="ph-l"><span>'+t('chem.ph0')+'</span><span>'+t('chem.ph7')+'</span><span>'+t('chem.ph14')+'</span></div></div>';

/* Directions shown on the home page, the housekeeper dashboard and in the footer */
const HK_TILES=[['sanitary','shield','01'],['mech','cart','02'],['chem','flask','03'],['exp','bulb','04'],['photo','camera','05'],['recs','chat','06'],['restore','wrench','07'],['standards','list','08'],['sched','cal','09'],['household','flask','10']];
const tile=([id,icon,num])=>A(id,'<div class="tile-h"><span class="ti">'+ic(icon)+'</span><span class="tn">'+num+'</span></div><div class="tt">'+t('tile.'+id)+'</div><div class="ts">'+t('tile.'+id+'.s')+'</div>','tile');
const tilesHTML=()=>HK_TILES.map(tile).join('');

/* Sidebar sections (desktop) */
const SIDE_HK=[['dashboard','home','title.dashboard'],['photo','camera','title.photo'],['chem','flask','title.chem'],['household','flask','title.household'],['mech','cart','title.mech'],['standards','list','title.standards'],['sanitary','shield','title.sanitary'],['restore','wrench','title.restore'],['exp','bulb','title.exp'],['recs','chat','title.recs'],['sched','cal','title.sched'],['ai','mic','title.ai'],['profile','user','title.profile']];
const SIDE_MG=[['manager','home','title.manager'],['mschedule','cal','title.msched'],['msend','send','title.msend']];

/* Feature cards (features page) */
const FEAT_HK=[['photo','camera','tile.photo','photo.lead'],['chem','flask','tile.chem','chem.lead'],['household','flask','tile.household','hh.lead'],['mech','cart','tile.mech','mech.lead'],['standards','list','tile.standards','feat.std'],['sanitary','shield','tile.sanitary','san.lead'],['restore','wrench','tile.restore','rs.lead'],['exp','bulb','tile.exp','exp.lead'],['recs','chat','tile.recs','recs.note'],['sched','cal','tile.sched','sc.how'],['ai','mic','title.ai','feat.ai']];
const FEAT_MG=[['manager','doc','title.manager','feat.mhome'],['mschedule','cal','title.msched','mc.lead'],['msend','send','mg.ctaT','mg.ctaD']];
const featCard=([id,icon,tk,dk])=>A(id,'<span class="ti">'+ic(icon)+'</span><h3>'+t(tk)+'</h3><p>'+t(dk)+'</p><span class="more">'+t('feat.open')+ic('right','sm')+'</span>','feat');

const V={};

/* Housekeeper home */
V.dashboard=()=>{
  const NEXT=DAYS.find(d=>d.i>0&&d.staff.includes(ME));
  const sh=NEXT&&myShare(NEXT);
  const next=NEXT?A('sched','<div class="row sb"><span class="g sm" style="font-weight:700;display:flex;gap:6px;align-items:center">'+ic('cal','sm')+' '+t('dash.next')+'</span>'+lvBadge(NEXT)+'</div><p class="txt"><b>'+dLabel(NEXT)+'</b> · 08:00-16:30 · '+(sh.dep+sh.stay)+' '+t('dash.rooms')+', ~'+fmtM(sh.min)+'</p>'+(NEXT.plan.length||NEXT.lvl==='low'?'<p class="mut xs">'+t('dash.lowNote')+'</p>':''),'card'):'';
  return scr(
  '<div class="appbar"><span class="mini-logo">'+ICON+'</span><span class="brand">Innboard<span>.ai</span></span>'+A('recs',ic('bell')+'<span class="dot"></span>','icon-btn','aria-label="'+esc(t('dash.bell'))+'"')+'</div>'+
  '<h1 class="hello">'+t('dash.hello')+'</h1><p class="lead">'+t('dash.sub')+'</p>'+
  A('recs','<div class="row sb"><span class="t">'+t('dash.prioT')+'</span><span class="badge fill">'+t('prio.high')+'</span></div><p class="txt">'+t('dash.prioTxt')+'</p><p class="m">'+t('dash.prioM')+'</p>','prio')+
  A('photo','<span class="cta-i">'+ic('camera','lg')+'</span><div><div class="cta-t">'+t('home.ctaT')+'</div><div class="cta-d">'+t('home.ctaD')+'</div></div>','cta')+
  next+
  '<h2 class="h2">'+t('home.dirs')+'</h2>'+
  '<div class="tiles dash">'+tilesHTML()+'</div>'+
  A('ai','<span class="ti">'+ic('mic','lg')+'</span><div><b style="font-size:16px">'+t('home.voiceT')+'</b><div class="mut sm">'+t('home.voiceD')+'</div></div>','voice'),
  tabbar(HK_TABS,'dashboard'));
};

/* Photo check: surface + product type (+ optional photos) -> verdict */
const PTYPES=['acid','chlorine','ammonia','abrasive','alkaline','alcohol','neutral','unknown'];
V.photo=()=>scr(hdr('title.photo','05')+
  '<h1 class="big">'+t('photo.big')+'</h1><p class="lead">'+t('photo.lead')+'</p>'+
  '<div class="slots">'+
  B('data-slot="surface"','<img class="pv" alt="'+esc(t('photo.alt1'))+'"><span class="ti">'+ic('camera','lg')+'</span><div class="t">'+t('photo.s1t')+'</div><div class="d">'+t('photo.s1d')+'</div><span class="tag">'+t('photo.tag1')+'</span>','slot')+
  B('data-slot="product"','<img class="pv" alt="'+esc(t('photo.alt2'))+'"><span class="ti">'+ic('spray','lg')+'</span><div class="t">'+t('photo.s2t')+'</div><div class="d">'+t('photo.s2d')+'</div><span class="tag">'+t('photo.tag2')+'</span>','slot')+
  '</div>'+
  '<p class="mut xs">'+t('photo.optional')+'</p>'+
  '<p class="lbl">'+t('chem.pick')+'</p>'+
  '<div class="chips" data-group="surf">'+D().SURF.map(x=>B('data-surf="'+x.k+'"','<span>'+x.n+'</span>','chip')).join('')+'</div>'+
  '<p class="lbl">'+t('photo.pickType')+'</p>'+
  '<div class="chips" data-group="ptype">'+PTYPES.map(k=>B('data-ptype="'+k+'"','<span>'+t('pt.'+k)+'</span>','chip')).join('')+'</div>'+
  '<input class="pname" data-product-name placeholder="'+esc(t('photo.name'))+'" aria-label="'+esc(t('photo.name'))+'">'+
  '<p class="mut xs" data-detected hidden></p>'+
  B('data-check-run',ic('check')+' '+t('photo.run'),'btn')+
  '<div class="card"><h3 class="h3">'+t('photo.tipsT')+'</h3>'+dots([t('photo.tip1'),t('photo.tip2'),t('photo.tip3')])+'</div>'+
  '<div class="divider">'+t('photo.or')+'</div>'+
  B('data-photo-example','<img src="'+EX_IMG+'" alt=""><div><div class="g sm" style="font-weight:700">'+t('photo.tryEx')+'</div><b>'+t('photo.exT')+'</b></div>','example')+
  '<div class="card hl" data-result hidden><div class="anl" data-analyzing><span class="spin"></span><span>'+t('photo.anl')+'</span></div><div data-analysis hidden style="display:flex;flex-direction:column;gap:12px"></div></div>',
  tabbar(HK_TABS,'photo'));

/* Compatibility rules: product type x surface group -> yes / no / caution */
const SGROUP={marble:'calc',trav:'calc',lime:'calc',gran:'gran',bas:'bas',cer:'cer',steel:'steel',wood:'wood',glass:'glass'};
const RULES={
  acid:{calc:'no',gran:'caution',bas:'caution',cer:'yes',steel:'caution',wood:'no',glass:'caution'},
  chlorine:{calc:'no',gran:'no',bas:'caution',cer:'yes',steel:'no',wood:'no',glass:'caution'},
  ammonia:{calc:'no',gran:'caution',bas:'caution',cer:'caution',steel:'caution',wood:'no',glass:'yes'},
  abrasive:{calc:'no',gran:'no',bas:'caution',cer:'caution',steel:'no',wood:'no',glass:'no'},
  alkaline:{calc:'caution',gran:'caution',bas:'yes',cer:'yes',steel:'caution',wood:'no',glass:'caution'},
  alcohol:{calc:'caution',gran:'caution',bas:'caution',cer:'yes',steel:'yes',wood:'caution',glass:'yes'},
  neutral:{calc:'yes',gran:'yes',bas:'yes',cer:'yes',steel:'yes',wood:'yes',glass:'yes'},
  unknown:{calc:'caution',gran:'caution',bas:'caution',cer:'caution',steel:'caution',wood:'caution',glass:'caution'}
};
/* Recognise the product type from its name, in any of the three languages */
const PT_RE={
  chlorine:/chlor|bleach|hypochl|хлор|белизн|ქლორ|ჰიპოქლორ|მათეთრ/i,
  acid:/acid|citric|vinegar|kalk|lime ?scale|descal|кислот|уксус|налёт|налет|антинакип|მჟავ|ლიმონ|ძმარ|კირის/i,
  ammonia:/ammon|аммиак|нашатыр|ამიაკ/i,
  abrasive:/abras|powder|scrub|cream cleanser|абраз|порош|скраб|აბრაზ|ფხვნილ|სკრაბ/i,
  alkaline:/alkal|degreas|oven|soda|щёлоч|щелоч|жир|сода|ტუტე|ცხიმ|სოდა/i,
  alcohol:/alcohol|spirit|glass clean|спирт|стекл|სპირტ|მინის/i,
  neutral:/neutral|ph ?7|нейтрал|ნეიტრალ/i
};
const detectType=name=>{if(!name)return null;for(const k of Object.keys(PT_RE))if(PT_RE[k].test(name))return k;return null};
function evaluateCheck(surfKey,type){
  const s=D().SURF.find(x=>x.k===surfKey),g=SGROUP[surfKey],v=RULES[type][g];
  const r={verdict:v,surface:s.n+' · '+s.sub,product:t('pt.'+type),reason:t('why.'+type)+(v==='no'?' '+s.d:v==='caution'?' '+t('why.test'):''),steps:s.how};
  if(v!=='yes')r.instead=s.use[0];
  if(g==='calc')r.manager=t('recs.f1');else if(g==='bas')r.manager=t('recs.f2');
  return r;
}

/* Verdict card */
function verdictHTML(r,photos){
  const VD={no:['verdict.no','x'],yes:['verdict.yes','check'],caution:['verdict.caution','alert']};
  const v=VD[r.verdict]?r.verdict:'caution', L=a=>Array.isArray(a)?a:[];
  const pics=(photos||[]).filter(Boolean);
  return '<div class="verdict '+v+'"><span class="vi">'+ic(VD[v][1],'lg')+'</span><div><b>'+t(VD[v][0])+'</b>'+(r.label?'<span class="mut xs">'+esc(r.label)+'</span>':'')+'</div></div>'+
  (pics.length?'<div class="thumbs">'+pics.map(u=>'<img src="'+u+'" alt="">').join('')+'</div>':'')+
  (r.surface?'<div class="kv"><span>'+t('verdict.surface')+'</span><b>'+esc(r.surface)+'</b></div>':'')+
  (r.stain?'<div class="kv"><span>'+t('verdict.stain')+'</span><b>'+esc(r.stain)+'</b></div>':'')+
  (r.product?'<div class="kv"><span>'+t('verdict.product')+'</span><b>'+esc(r.product)+(r.active?' · <span class="o">'+esc(r.active)+'</span>':'')+'</b></div>':'')+
  (r.reason?'<p class="txt">'+esc(r.reason)+'</p>':'')+
  (r.manager?'<div class="box-o"><b>'+t('verdict.mgr')+'</b>'+esc(r.manager)+'</div>':'')+
  (r.instead?'<div class="box-g"><b>'+t(v==='yes'?'verdict.best':'verdict.instead')+'</b>'+esc(r.instead)+'</div>':'')+
  (L(r.steps).length?'<h3 class="h3" style="margin:4px 0 0">'+t('verdict.how')+'</h3>'+steps(L(r.steps).map(esc)):'')+
  '<p class="mut xs">'+t('verdict.disc')+'</p>'+
  '<div class="btns">'+A('chem',t('verdict.chem'),'btn sm')+A('household',t('verdict.hh'),'btn sm ghost')+'</div>'+
  '<div class="btns">'+A('restore',t('verdict.restore'),'btn sm ghost')+B('data-check-reset',t('photo.again'),'btn sm ghost')+'</div>';
}

/* Chemicals and surfaces */
V.chem=()=>{const SURF=D().SURF;return scr(hdr('title.chem','03')+
  '<h1 class="big">'+t('chem.big')+'</h1><p class="lead">'+t('chem.lead')+'</p>'+
  '<div class="card"><h3 class="h3">'+t('chem.vsT')+'</h3><div class="vs"><div class="home"><b class="o">'+t('chem.vsHome')+'</b>'+t('chem.vsHomeD')+'</div><div class="pro"><b class="g">'+t('chem.vsPro')+'</b>'+t('chem.vsProD')+'</div></div></div>'+
  A('household','<span class="ti">'+ic('flask')+'</span><div style="flex:1"><b>'+t('chem.noPro')+'</b><div class="mut sm">'+t('chem.noProD')+'</div></div>'+ic('right'),'voice')+
  '<h2 class="h2">'+t('chem.pick')+'</h2>'+
  '<div class="chips" data-tabs="surf">'+SURF.map((s,i)=>chip(s.n,!i,'data-tab="'+s.k+'"')).join('')+'</div>'+
  SURF.map((s,i)=>'<div data-pane="surf:'+s.k+'"'+(i?' hidden':'')+' style="display:flex;flex-direction:column;gap:14px">'+
    '<div class="card"><div class="row sb" style="flex-wrap:wrap"><h2 class="h2" style="margin:0;font-size:24px">'+s.n+'</h2><span class="badge '+s.l+'">'+s.lt+'</span></div><p class="mut sm">'+s.sub+'</p><p class="txt">'+s.d+'</p>'+phScale(s.ph[0],s.ph[1])+'</div>'+
    '<div class="pair"><div class="card ok"><h3 class="h3 g">'+ic('check','sm')+' '+t('chem.use')+'</h3>'+dots(s.use,'g')+'</div>'+
    '<div class="card warn"><h3 class="h3 o">'+ic('x','sm')+' '+t('chem.never')+'</h3>'+dots(s.never,'o')+'</div></div>'+
    '<h2 class="h2">'+t('chem.how')+'</h2>'+steps(s.how)+'</div>').join(''),
  tabbar(HK_TABS,'chem'));};

/* Household chemicals fallback */
V.household=()=>{const d=D();return scr(hdr('title.household','10')+
  '<h1 class="big">'+t('hh.big')+'</h1><p class="lead">'+t('hh.lead')+'</p>'+
  '<div class="card warn"><h3 class="h3 o">'+ic('alert','sm')+' '+t('hh.beforeT')+'</h3><p class="txt">'+t('hh.before')+'</p>'+B('data-toast="'+esc(t('toast.reqMgr'))+'"',t('hh.reqBtn'),'btn sm or')+'</div>'+
  '<h2 class="h2">'+t('hh.rulesT')+'</h2>'+steps(t('hh.rules'))+
  '<h2 class="h2">'+t('hh.pick')+'</h2>'+
  '<div class="chips" data-tabs="hh">'+d.HH.map((h,i)=>chip(h.n,!i,'data-tab="'+h.k+'"')).join('')+'</div>'+
  d.HH.map((h,i)=>'<div data-pane="hh:'+h.k+'"'+(i?' hidden':'')+' style="display:flex;flex-direction:column;gap:12px">'+
    '<div class="card"><h2 class="h2" style="margin:0;font-size:21px">'+h.n+'</h2><div class="mut xs">'+t('hh.usual')+'</div><p class="txt">'+h.pro+'</p></div>'+
    '<div class="pair"><div class="card ok"><h3 class="h3 g">'+ic('check','sm')+' '+t('hh.sub')+'</h3><p class="txt">'+h.sub+'</p><div class="mut xs">'+t('hh.where')+'</div><p class="txt">'+h.ok+'</p></div>'+
    '<div class="card warn"><h3 class="h3 o">'+ic('x','sm')+' '+t('hh.no')+'</h3>'+dots(h.no,'o')+'</div></div>'+
    '<h2 class="h2">'+t('hh.how')+'</h2>'+steps(h.st)+
    '<div class="note"><b>'+t('hh.risk')+'</b><span>'+h.risk+'</span></div></div>').join('')+
  '<h2 class="h2">'+t('hh.labelT')+'</h2>'+
  '<div class="stepsl" style="gap:8px">'+d.LABEL.map((l,i)=>'<div class="plan-row"><div class="n"><b>'+l[1]+'</b><small>'+t('hh.onLabel')+': '+l[0]+'</small></div><span class="m" style="white-space:normal;text-align:right;max-width:45%">'+(i===4?'':t('hh.notOn')+': ')+l[2]+'</span></div>').join('')+'</div>'+
  '<h2 class="h2">'+t('hh.casesT')+'</h2>'+
  '<div class="pair">'+d.HCASES.map(c=>'<div class="card case"><div class="src"><span>'+c[1]+'</span><span class="badge '+(c[0]==='ok'?'lo':'hi')+'">'+t(c[0]==='ok'?'hh.okBadge':'hh.badBadge')+'</span></div><h3 class="h3" style="margin:0;font-size:16px">'+c[2]+'</h3><div class="'+(c[0]==='ok'?'box-g':'box-o')+'"><b>'+t('hh.what')+'</b>'+c[3]+'</div><p class="lesson">'+ic('star','sm')+' <b>'+t('hh.lesson')+':</b> '+c[4]+'</p></div>').join('')+'</div>',
  '<div class="foot">'+A('photo',ic('camera')+' '+t('hh.photoFirst'),'btn')+'</div>');};

/* Mechanical cleaning */
V.mech=()=>{const d=D();const pads=t('mech.pads'),padC=['#f3f3f0','#d9534c','#4a8fe0','#2f8a48','#1c1c1c'];
  const missing=d.TROLLEY.filter((x,i)=>!stGet('trolley',i,!!x[1])).length;
  return scr(hdr('title.mech','02')+
  '<h1 class="big">'+t('mech.big')+'</h1><p class="lead">'+t('mech.lead')+'</p>'+
  '<h2 class="h2">'+t('mech.colorsT')+'</h2>'+
  '<div class="colors">'+[['blue','#4a8fe0'],['red','#e0564d'],['yellow','#e8c55a'],['green','#3f9b58']].map(([k,c])=>'<div class="cz"><i style="background:'+c+'"></i><div><b>'+t('mech.c.'+k)+'</b>'+t('mech.c.'+k+'D')+'</div></div>').join('')+'</div>'+
  '<p class="mut sm">'+t('mech.redNote')+'</p>'+
  '<h2 class="h2">'+t('mech.padsT')+'</h2>'+
  '<div class="pads">'+pads.map((p,i)=>'<div><i style="background:'+padC[i]+'"></i>'+p+'</div>').join('')+'</div>'+
  '<p class="mut sm">'+t('mech.padsNote')+'</p>'+
  '<h2 class="h2">'+t('chem.pick')+'</h2>'+
  '<div class="chips" data-tabs="mech">'+d.MECH.map((m,i)=>chip(m.n,!i,'data-tab="'+m.k+'"')).join('')+'</div>'+
  d.MECH.map((m,i)=>'<div class="card" data-pane="mech:'+m.k+'"'+(i?' hidden':'')+' style="gap:12px">'+
    '<div class="row sb" style="align-items:flex-start;flex-wrap:wrap"><h2 class="h2" style="margin:0;font-size:22px">'+m.n+'</h2><span class="badge '+m.c+'">'+m.ct+'</span></div>'+
    '<div><div class="mut xs">'+t('mech.tool')+'</div><p class="txt">'+m.tool+'</p></div>'+
    '<div><div class="mut xs">'+t('mech.tech')+'</div><p class="txt">'+m.tech+'</p></div>'+
    '<div class="box-g" style="background:var(--card2)"><b>'+t('mech.ex')+'</b>'+m.ex+'</div>'+
    '<div class="box-o" style="display:flex;gap:10px"><span class="o">'+ic('x','sm')+'</span><span>'+m.w+'</span></div>'+
    video('video.ex','video.exSub',m.n+' '+m.tool)+'</div>').join('')+
  '<div class="card"><h2 class="h2" style="margin:0">'+t('mech.trolleyT')+'</h2><p class="mut sm">'+t('mech.trolleyD')+'</p>'+
  d.TROLLEY.map((x,i)=>{const on=stGet('trolley',i,!!x[1]);return B('data-check data-id="'+i+'"','<span class="box">'+ic('check','sm')+'</span><span>'+x[0]+'</span>','chk'+(on?' done':''))}).join('')+
  '<p class="mut sm">'+t('mech.missing')+': <b style="color:var(--ink)" data-missing>'+missing+'</b> '+t('mech.items')+'</p>'+
  B('data-toast="'+esc(t('toast.reqMgr'))+'"',t('mech.reqBtn'),'btn sm')+'</div>'+
  '<div class="card"><h3 class="h3">'+ic('store','sm')+' '+t('mech.buyT')+'</h3><p class="txt mut">'+t('mech.buyD')+'</p><p class="txt">'+t('mech.supplier')+'</p></div>');};

/* Cleaning standards with a step-by-step player */
const stepPanel=(arr,g)=>{const total=arr.reduce((s,x)=>s+x[1],0);
  return '<div data-steps="'+g+'" data-cur="0" style="display:flex;flex-direction:column;gap:14px">'+
  '<div class="row sb mut sm"><span>'+t(g==='dep'?'std.full':'std.quick')+' · ~'+total+' '+t('u.min')+'</span><b style="color:var(--ink);font-family:var(--num)" data-step-count>1 / '+arr.length+'</b></div>'+
  '<div class="progress"><i data-step-bar style="width:'+(100/arr.length)+'%"></i></div>'+
  arr.map((s,i)=>'<div class="card hl" data-step'+(i?' hidden':'')+' style="gap:12px"><div class="row sb"><span class="g sm" style="font-weight:700">'+t('std.step')+' '+(i+1)+'</span><span class="badge lo">'+s[2]+'</span></div><h2 class="h2" style="margin:0;font-size:22px">'+s[0]+'</h2><p class="txt">'+s[3]+'</p><div><span class="chip" style="padding:4px 12px;font-size:13px">~'+s[1]+' '+t('u.min')+'</span></div>'+video('video.see','video.stepSub',s[0])+'<div class="btns">'+B('data-step-prev',t('back'),'btn ghost')+B('data-step-next',t('std.next'),'btn')+'</div></div>').join('')+
  '<h2 class="h2">'+t('std.seq')+'</h2><div class="stepsl" style="gap:8px">'+arr.map((s,i)=>B('data-step-go="'+i+'"','<span class="sn">'+(i+1)+'</span><span>'+s[0]+'</span>','seqi'+(i?'':' on'))).join('')+'</div></div>';};
V.standards=()=>scr(hdr('title.standards','08')+
  '<div class="seg" data-tabs="std">'+chip(t('std.dep'),1,'data-tab="dep"')+chip(t('std.stay'),0,'data-tab="stay"')+'</div>'+
  '<div class="card"><h3 class="h3">'+t('std.order')+'</h3><div class="order"><span class="badge hi">'+t('std.o1')+'</span>→<span class="badge blue">'+t('std.o2')+'</span>→<span class="badge lo">'+t('std.o3')+'</span></div></div>'+
  '<div data-pane="std:dep">'+stepPanel(D().DEP,'dep')+'</div>'+
  '<div data-pane="std:stay" hidden>'+stepPanel(D().STAY,'stay')+'</div>');

/* Manager recommendations for the housekeeper */
const task=(room,lv,txt,meta,photo)=>'<div class="card task'+(lv==='high'?' warn':'')+(stGet('done',room,false)?' done':'')+'" data-id="'+room+'"><div class="row sb"><b style="font-size:17px">'+t('recs.room')+' '+room+'</b><span class="badge '+(lv==='high'?'fill':'mid')+'">'+t('prio.'+lv)+'</span></div><p class="txt">'+t(txt)+'</p><p class="mut xs">'+t(meta)+'</p><div class="btns">'+(photo?A('photo',t('recs.photo'),'btn sm ghost'):'')+B('data-done',t('recs.did'),'btn sm')+(photo?'':'<span></span>')+'</div></div>';
V.recs=()=>scr(hdr('title.recs','06')+
  '<div class="row sb"><h2 class="h2" style="margin:0">'+t('recs.today')+'</h2><span class="mut sm" style="text-align:right"><span data-donecount>0 / 3</span><br>'+t('recs.doneLbl')+'</span></div>'+
  task('204','high','recs.t1','recs.t1m',1)+task('305','mid','recs.t2','recs.t2m',0)+task('112','mid','recs.t3','recs.t3m',1)+
  '<h2 class="h2">'+t('recs.fixed')+'</h2>'+
  '<div class="pair"><div class="card warn"><span class="o xs" style="font-weight:700">'+t('recs.f1t')+'</span><p class="txt">'+t('recs.f1')+'</p></div>'+
  '<div class="card warn"><span class="o xs" style="font-weight:700">'+t('recs.f2t')+'</span><p class="txt">'+t('recs.f2')+'</p></div></div>'+
  '<p class="mut xs">'+t('recs.note')+'</p>'+
  '<div class="card" data-chat="manager"><h2 class="h2" style="margin:0">'+t('recs.askT')+'</h2><div class="msgs"><div class="msg">'+t('recs.hello')+'<small>'+t('recs.mgrName')+'</small></div></div>'+
  '<div class="chips" style="flex-direction:column;align-items:flex-start">'+['recs.q1','recs.q2','recs.q3'].map(k=>chip(t(k),0,'data-ask')).join('')+'</div>'+
  '<div class="composer"><input data-chat-input placeholder="'+esc(t('chat.ph'))+'" aria-label="'+esc(t('recs.askT'))+'">'+B('data-send aria-label="'+esc(t('chat.send'))+'"',ic('send'),'send')+'</div></div>');

/* Sanitary rules */
V.sanitary=()=>scr(hdr('title.sanitary','01')+
  '<h1 class="big">'+t('san.big')+'</h1><p class="lead">'+t('san.lead')+'</p>'+
  '<div class="card warn"><h3 class="h3 o">'+ic('alert')+' '+t('san.mixT')+'</h3><div class="mix">'+[1,2,3].map(n=>'<div><b>'+t('san.m'+n)+'</b> <span class="o">'+t('san.m'+n+'r')+'</span></div>').join('')+'</div><p class="sm o" style="opacity:.9">'+t('san.warn')+'</p></div>'+
  D().SAN.map((s,i)=>'<div class="acc'+(i?'':' open')+'">'+B('data-acc aria-expanded="'+(i?'false':'true')+'"','<span class="sn">'+(i+1)+'</span><span>'+s[0]+'</span><span class="x">'+ic('down')+'</span>','acc-h')+'<div class="acc-b">'+dots(s[1])+'<div class="note"><b>'+t('san.remember')+'</b><span>'+s[2]+'</span></div></div></div>').join(''),
  '<div class="foot">'+A('standards',t('san.toStd'),'btn')+'</div>');

/* Experience from other hotels */
V.exp=()=>scr(hdr('title.exp','04')+
  '<h1 class="big">'+t('exp.big')+'</h1><p class="lead">'+t('exp.lead')+'</p>'+
  '<div class="chips" data-filter>'+[['all',1],['stone'],['wood'],['metal']].map(([k,on])=>chip(t('exp.'+k),on,'data-cat-btn="'+k+'"')).join('')+'</div>'+
  D().CASES.map(c=>'<div class="card case" data-cat="'+c.cat+'"><div class="src"><span>'+c.src+'</span><span class="badge blue">'+c.tag+'</span></div><h2 class="h2" style="margin:0">'+c.t+'</h2><div class="pair"><div class="box-o"><b>'+t('hh.what')+'</b>'+c.what+'</div><div class="box-g"><b>'+t('exp.fix')+'</b>'+c.fix+'</div></div><p class="lesson">'+ic('star','sm')+' <b>'+t('hh.lesson')+':</b> '+c.les+'</p><div class="row sb"><span class="g xs">'+c.res+'</span>'+(ci=>B('data-useful data-id="'+ci+'"',t('exp.useful')+' · <span>'+(c.u+(stGet('useful',ci,false)?1:0))+'</span>','useful'+(stGet('useful',ci,false)?' on':'')))(D().CASES.indexOf(c))+'</div></div>').join(''));

/* Surface restoration */
V.restore=()=>{const DMG=D().DMG;return scr(hdr('title.restore','07')+
  '<h1 class="big">'+t('rs.big')+'</h1><p class="lead">'+t('rs.lead')+'</p>'+
  '<h2 class="h2">'+t('rs.what')+'</h2>'+
  '<div data-tabs="dmg" style="display:flex;flex-direction:column;gap:8px">'+DMG.map((d,i)=>B('data-tab="'+d.k+'"','<span>'+d.n+'</span><span>'+d.s+'</span>','dmg'+(i?'':' on'))).join('')+'</div>'+
  DMG.map((d,i)=>'<div data-pane="dmg:'+d.k+'"'+(i?' hidden':'')+' style="display:flex;flex-direction:column;gap:14px">'+
    '<div class="card"><div class="row sb" style="align-items:flex-start;flex-wrap:wrap"><h2 class="h2" style="margin:0;font-size:22px">'+d.n+'</h2><span class="badge mid" style="white-space:normal;text-align:center;max-width:170px">'+d.b+'</span></div>'+
    '<div class="mut xs">'+t('rs.why')+'</div><p class="txt">'+d.why+'</p><div class="mut xs">'+t('rs.first')+'</div>'+steps(d.st)+
    '<div class="box-o" style="display:flex;gap:10px"><span class="o">'+ic('x','sm')+'</span><span>'+d.w+'</span></div></div>'+
    '<div class="card blue"><div class="expert"><span class="av">'+ic('user')+'</span><div><div class="b xs" style="font-weight:700">'+t('rs.expRec')+'</div><b>'+t('rs.expName')+'</b></div></div><p class="txt">'+d.ex+'</p><div class="note bluenote"><b>'+t('rs.prod')+'</b><span>'+d.pr+'</span></div>'+
    B('data-toast="'+esc(t('rs.consultSent'))+'"',t('rs.consult'),'btn lb')+'<p class="b xs" style="opacity:.8">'+t('rs.attach')+'</p></div></div>').join(''),
  '<div class="foot">'+A('photo',ic('camera')+' '+t('rs.photoBtn'),'btn')+'</div>');};

/* AI assistant: chat + practice */
const TOPIC={chem:['title.chem','chem'],sanitary:['title.sanitary','sanitary'],mech:['title.mech','mech'],household:['title.household','household']};
const quizCard=(x,i,qi)=>'<div class="card quiz" data-quiz data-qi="'+qi+'" data-topic="'+x.t+'"><div class="row sb"><span class="g xs" style="font-weight:700">'+t('ai.ex')+' '+(i+1)+'</span><span class="badge blue">'+t(TOPIC[x.t][0])+'</span></div><p class="txt"><b>'+x.q+'</b></p>'+x.o.map((o,j)=>B('data-ans="'+(j===x.c?'1':'0')+'"',o,'qopt')).join('')+'<div class="note" data-expl hidden style="flex-direction:column;gap:4px"><b>'+t('ai.expl')+'</b><span>'+x.e+'</span></div></div>';
V.ai=()=>scr(hdr('title.ai')+
  '<div class="seg" data-tabs="aitab">'+chip(t('ai.chatTab'),1,'data-tab="chat"')+chip(t('ai.trainTab'),0,'data-tab="train"')+'</div>'+
  '<div data-pane="aitab:chat" style="display:flex;flex-direction:column;gap:12px">'+
  '<div class="card" data-chat="ai" style="background:transparent;border:0;padding:0;gap:12px"><div class="msgs"><div class="msg">'+t('ai.greet')+'</div></div>'+
  '<div class="chips">'+['ai.q1','ai.q2','ai.q3'].map(k=>chip(t(k),0,'data-ask')).join('')+'</div>'+
  '<div class="attach-pv" data-attach-pv hidden><img alt=""><span>'+t('ai.attached')+'</span>'+B('data-attach-clear aria-label="'+esc(t('ai.clear'))+'"',ic('x','sm'),'chip')+'</div>'+
  '<div class="composer">'+B('data-attach aria-label="'+esc(t('ai.attach'))+'"',ic('camera'),'send')+'<input data-chat-input placeholder="'+esc(t('chat.ph'))+'" aria-label="'+esc(t('title.ai'))+'">'+B('data-send aria-label="'+esc(t('chat.send'))+'"',ic('send'),'send')+'</div></div></div>'+
  '<div data-pane="aitab:train" hidden style="display:flex;flex-direction:column;gap:12px">'+
  '<div class="card blue"><h3 class="h3 b">'+ic('star','sm')+' '+t('ai.recT')+'</h3><p class="txt" data-train-rec>'+t('ai.recD')+'</p><p class="sm">'+t('ai.score')+': <span class="score" data-score>0 / 0</span></p></div>'+
  '<div class="stepsl" data-quiz-list style="gap:12px">'+D().QUIZ.map((x,i)=>quizCard(x,i,i)).join('')+'</div>'+
  B('data-quiz-gen',ic('plus')+' '+t('ai.gen'),'btn ghost')+'</div>',
  tabbar(HK_TABS,''));

/* Profile (with language and theme preferences) */
V.profile=()=>scr(hdr('title.profile')+
  '<div class="card" style="flex-direction:row;align-items:center;gap:14px"><span class="av" style="background:var(--avg);color:var(--acc2);width:60px;height:60px">'+ic('user','lg')+'</span><div><b style="font-size:18px">'+t('pf.name')+'</b><div class="mut sm">'+t('pf.role')+'</div><div class="mut sm" style="font-family:var(--num)">+995 5XX XX XX XX</div></div></div>'+
  '<div class="stats"><div class="stat"><b>14</b><span>'+t('pf.s1')+'</span></div><div class="stat"><b>3</b><span>'+t('pf.s2')+'</span></div><div class="stat hl"><b>96%</b><span>'+t('pf.s3')+'</span></div></div>'+
  '<div class="card"><h3 class="h3">'+t('pf.langT')+'</h3><div class="langs">'+[['ka','ქართული'],['en','English'],['ru','Русский']].map(([l,n])=>'<button type="button" class="lang'+(l===LANG?' on':'')+'" data-lang="'+l+'">'+n+'</button>').join('')+'</div>'+
  '<div class="seg">'+['dark','light'].map(th=>'<button type="button" class="chip'+(theme()===th?' on':'')+'" data-theme-pick="'+th+'">'+t('pf.'+th)+'</button>').join('')+'</div></div>'+
  A('login',t('pf.role2'),'btn ghost')+A('home',t('pf.out'),'btn ghost'),
  tabbar(HK_TABS,'profile'));

/* Housekeeper schedule */
V.sched=()=>{
  const mine=DAYS.filter(d=>d.staff.includes(ME)),wk=DAYS.slice(0,7),wkMine=wk.filter(d=>d.staff.includes(ME));
  const busiest=wkMine.slice().sort((a,b)=>b.load-a.load)[0];
  const plannedCnt=mine.reduce((n,d)=>n+d.plan.length+(d.lvl==='low'?d.sugg.slice(0,1).length:0),0);
  const first=DAYS[0].staff.includes(ME)?0:(mine[0]?mine[0].i:0);
  const DEEP=D().DEEP;
  const pane=d=>{const works=d.staff.includes(ME);
    if(!works)return '<div data-pane="hday:d'+d.i+'"'+(d.i===first?'':' hidden')+'><div class="card" style="gap:10px"><div class="row sb"><h2 class="h2" style="margin:0">'+dLabel(d)+'</h2><span class="badge white">'+t('sc.off')+'</span></div><p class="txt">'+t('sc.noShift')+' <b>'+d.load+'%</b> ('+t('lv.'+d.lvl).toLowerCase()+').</p><p class="mut sm">'+t('sc.onShift')+' '+d.staff.map(staffName).join(', ')+'</p>'+B('data-toast="'+esc(t('toast.reqMgr'))+'"',t('sc.swap'),'btn sm ghost')+'</div></div>';
    const sh=myShare(d),rm=myRooms(d,sh.dep,sh.stay),tasks=d.plan.concat(d.lvl==='low'?d.sugg.slice(0,1):[]);
    return '<div data-pane="hday:d'+d.i+'"'+(d.i===first?'':' hidden')+' style="display:flex;flex-direction:column;gap:12px">'+
    '<div class="card hl" style="gap:10px"><div class="row sb" style="flex-wrap:wrap"><h2 class="h2" style="margin:0">'+dLabel(d)+'</h2>'+lvBadge(d)+'</div>'+
    '<p class="mut sm">'+t('sc.shiftLine')+' '+d.staff.map(staffName).join(', ')+'</p>'+
    '<div class="loadbar"><i class="'+d.lvl+'" style="width:'+Math.min(100,d.load)+'%"></i></div>'+
    '<div class="trio"><div><b>'+sh.dep+'</b><span>'+t('sc.dep')+'</span></div><div><b>'+sh.stay+'</b><span>'+t('sc.stay')+'</span></div><div><b style="font-size:16px;line-height:30px">'+fmtM(sh.min)+'</b><span>'+t('sc.est')+'</span></div></div>'+
    '<div class="mut xs">'+t('sc.depRooms')+'</div><div class="rms">'+rm.dep.map(r=>'<span class="rm dep">'+r+'</span>').join('')+'</div>'+
    '<div class="mut xs">'+t('sc.stayRooms')+'</div><div class="rms">'+rm.stay.map(r=>'<span class="rm">'+r+'</span>').join('')+'</div></div>'+
    (d.lvl==='high'?'<div class="card warn"><h3 class="h3 o">'+ic('alert','sm')+' '+t('sc.busyT')+'</h3><p class="txt">'+t('sc.busy')+'</p></div>':'')+
    (tasks.length?'<div class="card ok"><h3 class="h3 g">'+ic('check','sm')+' '+t('sc.planT')+'</h3><p class="mut sm">'+t('sc.planD')+'</p>'+tasks.map(k=>'<div class="plan-row"><div class="n"><b>'+DEEP[k][0]+'</b><small>'+DEEP[k][2]+'</small></div><span class="m">'+fmtM(DEEP[k][1])+'</span>'+A(DEEP[k][5],t('sc.instr'),'btn ghost')+'</div>').join('')+'</div>':
      (d.lvl==='low'?'<div class="card ok"><p class="txt">'+t('sc.lowAsk')+'</p></div>':''))+'</div>';};
  return scr(hdr('title.sched','09')+
  '<h1 class="big">'+t('sc.big')+'</h1><p class="lead">'+t('sc.lead')+'</p>'+
  '<div class="trio"><div><b>'+wkMine.length+'</b><span>'+t('sc.shifts7')+'</span></div><div><b>'+(7-wkMine.length)+'</b><span>'+t('sc.off')+'</span></div><div><b>'+plannedCnt+'</b><span>'+t('sc.planned')+'</span></div></div>'+
  (busiest?'<p class="mut sm">'+t('sc.busiest')+' <b style="color:var(--ink)">'+dLabel(busiest)+'</b> ('+busiest.load+'%)</p>':'')+
  '<div class="legend"><span><i style="background:var(--good)"></i>'+t('lv.low')+'</span><span><i style="background:var(--yel)"></i>'+t('lv.mid')+'</span><span><i style="background:var(--red)"></i>'+t('lv.high')+'</span><span><i style="background:var(--sw)"></i>'+t('sc.off')+'</span></div>'+
  '<div class="cal" data-tabs="hday">'+DAYS.map(d=>{const w=d.staff.includes(ME);return B('data-tab="d'+d.i+'"','<span class="w">'+(d.i===0?t('d.today'):D().WD[d.w])+'</span><span class="n">'+d.d.getDate()+'</span><span class="s">'+t(w?'sc.shift':'sc.offShort')+'</span><span class="lv '+(w?d.lvl:'')+'"></span>','day'+(w?'':' off')+(d.i===first?' on':''))}).join('')+'</div>'+
  DAYS.map(pane).join('')+
  '<div class="card blue"><h3 class="h3 b">'+ic('info','sm')+' '+t('sc.howT')+'</h3><p class="txt">'+t('sc.how')+'</p></div>',
  tabbar(HK_TABS,'sched'));
};

/* Manager home */
V.manager=()=>{const wk=DAYS.slice(0,7),WD=D().WD;
  const forecast=A('mschedule','<div class="row sb"><h3 class="h3" style="margin:0">'+ic('cal','sm')+' '+t('mg.forecast')+'</h3>'+ic('right','sm')+'</div><div class="chart" style="height:110px">'+wk.map(d=>'<div class="bar"><span class="pc">'+d.load+'%</span><i class="'+d.lvl+'" style="height:'+Math.min(100,d.load)+'%"></i><span>'+WD[d.w]+'</span></div>').join('')+'</div><p class="mut xs">'+wk.filter(d=>d.lvl==='low').length+' '+t('mg.lowDays')+'</p>','card');
  const q=(who,min,qk,ak)=>'<div class="card qcard"><div class="row sb"><b>'+t(who)+'</b><span class="mut xs">'+min+' '+t('u.min')+'</span></div><p class="txt">'+t(qk)+'</p>'+B('data-suggest="'+esc(t(ak))+'"',ic('star','sm')+' '+t('mg.aiSuggest'),'chip')+'<textarea class="ta" placeholder="'+esc(t('mg.replyPh'))+'" aria-label="'+esc(t('mg.replyPh'))+'"></textarea>'+B('data-reply',t('mg.reply'),'btn sm')+'</div>';
  const S2=D().STAFF;
  return scr(
  '<div class="appbar"><span class="mini-logo">'+ICON+'</span><span class="brand" style="flex:none">Innboard<span>.ai</span></span><span class="badge mid" style="background:var(--mgrbg)">'+t('mg.badge')+'</span><span style="flex:1"></span>'+A('login',ic('expand'),'icon-btn','aria-label="'+esc(t('pf.role2'))+'"')+'</div>'+
  '<h1 class="hello">'+t('mg.hotel')+'</h1><p class="lead">'+t('mg.sub')+'</p>'+
  '<div class="stats"><div class="stat"><b>9/18</b><span>'+t('mg.st1')+'</span></div><div class="stat"><b>6</b><span>'+t('mg.st2')+'</span></div><div class="stat hl"><b>2</b><span>'+t('mg.st3')+'</span></div></div>'+
  A('msend','<span class="cta-i">'+ic('plus','lg')+'</span><div><div class="cta-t">'+t('mg.ctaT')+'</div><div class="cta-d">'+t('mg.ctaD')+'</div></div>','cta')+
  forecast+
  '<h2 class="h2">'+t('mg.photoNew')+'</h2>'+
  '<div class="card warn task"><div class="row"><img src="'+EX_IMG+'" alt="" style="width:72px;height:46px;border-radius:8px;object-fit:cover"><div><b>'+t('mg.pcWho')+'</b><div class="o xs">'+t('mg.pcWhat')+'</div></div></div><p class="txt">'+t('mg.pcTxt')+'</p><div class="btns">'+B('data-done data-toast="'+esc(t('mg.confirmed'))+'"',t('mg.confirm'),'btn sm or')+B('data-toast="'+esc(t('mg.goRoomT'))+'"',t('mg.goRoom'),'btn sm ghost')+'</div></div>'+
  '<div class="row sb"><h2 class="h2" style="margin:0">'+t('mg.qT')+'</h2><span class="mut sm">'+t('mg.qOpen')+'</span></div>'+
  '<div class="pair">'+q('mg.q1who',5,'mg.q1','mg.q1a')+q('mg.q2who',18,'mg.q2','mg.q2a')+'</div>'+
  '<h2 class="h2">'+t('mg.teamT')+'</h2>'+
  '<div class="pair">'+[[0,'mg.m1','3/5'],[1,'mg.m2','2/5'],[2,'mg.m3','-'],[3,'mg.m4','4/5']].map(([j,k,p])=>'<div class="mem"><span class="av">'+S2[j][0]+'</span><div class="n"><b>'+S2[j][1]+'</b><span>'+t(k)+'</span></div><span class="p">'+p+'</span></div>').join('')+'</div>',
  tabbar(MG_TABS,'manager'));};

/* Manager: send a priority or recommendation */
const pickRow=(arr,on)=>'<div class="chips" data-group>'+arr.map((x,i)=>chip(x,i===on)).join('')+'</div>';
V.msend=()=>{const st=D().STAFF.map(s=>s[1]);return scr(hdr('title.msend')+
  '<div class="seg" data-group>'+chip(t('ms.prio'),1)+chip(t('ms.gen'),0)+'</div>'+
  '<p class="lbl">'+t('ms.room')+'</p>'+pickRow(['101','112','204','210','305',t('ms.lobby')],2)+
  '<p class="lbl">'+t('ms.surf')+'</p>'+pickRow(t('ms.surfs'),0)+
  '<p class="lbl">'+t('ms.prioLbl')+'</p>'+pickRow([t('prio.high'),t('prio.mid'),t('prio.low')],0)+
  '<p class="lbl">'+t('ms.to')+'</p>'+pickRow([t('ms.team')].concat(st),2)+
  '<p class="lbl">'+t('ms.note')+'</p><textarea class="ta" style="min-height:120px" placeholder="'+esc(t('ms.notePh'))+'" aria-label="'+esc(t('ms.note'))+'"></textarea>'+
  '<div class="card" style="flex-direction:row;align-items:center;gap:12px"><div style="flex:1"><b>'+t('ms.aiT')+'</b><div class="mut xs">'+t('ms.aiD')+'</div></div>'+B('data-switch role="switch" aria-checked="true" aria-label="'+esc(t('ms.on'))+'"','','sw on')+'</div>'+
  B('data-send-mgr',t('msend.send'),'btn'),
  tabbar(MG_TABS,'msend'));};

/* Manager: workload and schedule */
const planRow=(k,btn)=>{const x=D().DEEP[k];return '<div class="plan-row" data-min="'+x[1]+'" data-k="'+k+'"><div class="n"><b>'+x[0]+'</b><small>'+x[2]+'</small></div><span class="m">'+fmtM(x[1])+'</span>'+(btn?B('data-plan-add',t('mc.add'),'btn'):'')+'</div>'};
V.mschedule=()=>{const DEEP=D().DEEP,WD=D().WD,wk=DAYS.slice(0,7),firstLow=DAYS.find(d=>d.lvl==='low');
  const pane=d=>{const nextLow=DAYS.find(x=>x.i>d.i&&x.lvl==='low')||firstLow;const free=d.free-d.plan.reduce((s,k)=>s+DEEP[k][1],0);
    return '<div data-pane="mday:d'+d.i+'"'+(d.i?' hidden':'')+' style="display:flex;flex-direction:column;gap:12px"><div class="card" style="gap:10px">'+
    '<div class="row sb" style="flex-wrap:wrap"><h2 class="h2" style="margin:0">'+dLabel(d)+'</h2>'+lvBadge(d)+'</div>'+
    '<div class="trio"><div><b>'+d.dep+'</b><span>'+t('sc.dep')+'</span></div><div><b>'+d.stay+'</b><span>'+t('sc.stay')+'</span></div><div><b>'+d.arr+'</b><span>'+t('sc.arr')+'</span></div></div>'+
    '<div class="loadbar"><i class="'+d.lvl+'" style="width:'+Math.min(100,d.load)+'%"></i></div>'+
    '<p class="mut sm">'+t('mc.need')+' ~'+fmtM(d.need)+' · '+t('mc.has')+' '+fmtM(d.cap)+' ('+d.staff.length+' '+t('mc.hk')+')</p>'+
    '<div class="chips">'+d.staff.map(j=>'<span class="chip" style="padding:5px 12px;font-size:13px">'+staffName(j)+'</span>').join('')+'</div></div>'+
    (d.lvl==='high'?'<div class="card warn"><h3 class="h3 o">'+ic('alert','sm')+' '+t('mc.highT')+'</h3><p class="txt">'+t('mc.high')+(nextLow?': '+t('mc.alt')+' <b>'+dLabel(nextLow)+'</b> ('+nextLow.load+'%)':'')+'.</p>'+B('data-toast="'+esc(t('mc.extraSent'))+'"',t('mc.extra'),'btn sm or')+'</div>':
    '<div class="card ok"><h3 class="h3 g">'+ic('check','sm')+' '+t('mc.free')+' <b data-free="'+free+'">'+fmtM(free)+'</b></h3><p class="txt">'+t(d.lvl==='low'?'mc.lowTxt':'mc.midTxt')+'</p>'+
      (d.sugg.length?'<div class="mut xs">'+t('mc.sugg')+'</div>'+d.sugg.map(k=>planRow(k,true)).join(''):'')+
      '<div class="mut xs">'+t('mc.plannedL')+'</div><div class="stepsl plan-list" data-plan-list data-empty="'+esc(t('mc.empty'))+'" style="gap:8px">'+d.plan.map(k=>planRow(k,false)).join('')+'</div></div>')+'</div>';};
  return scr(hdr('title.msched')+
  '<h1 class="big">'+t('mc.big')+'</h1><p class="lead">'+t('mc.lead')+'</p>'+
  '<div class="card"><div class="legend"><span><i style="background:var(--good)"></i>'+t('mc.lowLbl')+'</span><span><i style="background:var(--yel)"></i>'+t('lv.mid')+'</span><span><i style="background:var(--red)"></i>'+t('mc.highLbl')+'</span></div>'+
  '<div class="chart" data-tabs="mday">'+DAYS.map(d=>B('data-tab="d'+d.i+'"','<span class="pc">'+d.load+'%</span><i class="'+d.lvl+'" style="height:'+Math.min(100,d.load)+'%"></i><span>'+WD[d.w]+'</span><span>'+d.d.getDate()+'</span>','bar'+(d.i?'':' on'))).join('')+'</div>'+
  '<p class="mut xs">'+t('mc.tap')+'</p></div>'+
  DAYS.map(pane).join('')+
  '<h2 class="h2">'+t('mc.teamT')+'</h2><p class="mut sm">'+t('mc.teamD')+'</p>'+
  '<div class="card sched"><table class="st"><tr><th></th>'+wk.map(d=>'<th>'+WD[d.w]+'<br>'+d.d.getDate()+'</th>').join('')+'</tr>'+
  D().STAFF.map((s,j)=>'<tr><td>'+s[1]+'</td>'+wk.map(d=>{const on=stGet('shift',j+'-'+d.i,d.staff.includes(j));return '<td>'+B('data-shift data-id="'+j+'-'+d.i+'" aria-pressed="'+on+'" aria-label="'+esc(s[1]+' · '+WD[d.w]+' '+d.d.getDate())+'"',on?'✓':'-','shift'+(on?' on':''))+'</td>'}).join('')+'</tr>').join('')+'</table></div>'+
  '<h2 class="h2">'+t('mc.baseT')+'</h2>'+
  '<div class="stepsl" style="gap:8px">'+DEEP.map(x=>'<div class="plan-row"><div class="n"><b>'+x[0]+'</b><small>'+t('mc.every')+' '+x[3]+' '+t('mc.days')+' · '+t('mc.last')+' '+x[4]+' '+t('mc.ago')+'</small></div>'+(x[4]>x[3]?'<span class="badge hi">'+t('mc.overdue')+'</span>':'<span class="badge lo">'+t('mc.ontime')+'</span>')+'</div>').join('')+'</div>'+
  B('data-toast="'+esc(t('mc.sentAll'))+'"',t('mc.sendAll'),'btn'),
  tabbar(MG_TABS,'mschedule'));};


/* ---------- Saved state (checklists, done tasks, votes, shifts) ---------- */
const LS_STATE='innboard_state';
const STATE=(()=>{try{return JSON.parse(store.get(LS_STATE))||{}}catch(e){return {}}})();
function stGet(group,id,def){const g=STATE[group];return g&&Object.prototype.hasOwnProperty.call(g,id)?g[id]:def}
function stSet(group,id,val){(STATE[group]=STATE[group]||{})[id]=val;store.set(LS_STATE,JSON.stringify(STATE))}

/* ---------- 7. Router ---------- */
const PUBLIC=['home','features','about','contact','terms','login'];
const MANAGER=['manager','mschedule','msend'];
let current='';
let first=true;

/* Generated parts of the static pages (kept in sync with the language) */
function renderShared(){
  $$('[data-logo]').forEach(el=>{el.innerHTML=el.classList.contains('mini-logo')?ICON:LOGO});
  $$('[data-tiles]').forEach(el=>{el.innerHTML=tilesHTML()});
  const fh=$('[data-features="hk"]'),fm=$('[data-features="mg"]');
  if(fh)fh.innerHTML=FEAT_HK.map(featCard).join('');
  if(fm)fm.innerHTML=FEAT_MG.map(featCard).join('');
  const lh=$('[data-footlinks="hk"]'),lm=$('[data-footlinks="mg"]');
  if(lh)lh.innerHTML=['photo','chem','standards','sanitary','ai'].map(id=>'<li>'+A(id,t('title.'+id))+'</li>').join('');
  if(lm)lm.innerHTML=[['manager','title.manager'],['mschedule','title.msched'],['msend','title.msend']].map(([id,k])=>'<li>'+A(id,t(k))+'</li>').join('');
  const y=$('[data-year]');if(y)y.textContent=new Date().getFullYear();
  $$('[data-ex-img]').forEach(i=>{i.src=EX_IMG});
  /* Marquee: the list is doubled so the loop is seamless */
  const mq=$('[data-marquee]');
  if(mq){const items=HK_TILES.map(([id,icon])=>A(id,ic(icon,'sm')+'<span>'+t('tile.'+id)+'</span>','mq-item')).join('');mq.innerHTML='<div class="mq-track">'+items+items+'</div>'}
  const top=$('#toTop');if(top)top.setAttribute('aria-label',t('a11y.top'));
}
function renderSide(id){
  const link=([r,i,k])=>A(r,ic(i)+'<span>'+t(k)+'</span>',r===id?'on':'',r===id?'aria-current="page"':'');
  $('#side').innerHTML='<h4>'+t('side.hk')+'</h4>'+SIDE_HK.map(link).join('')+'<h4>'+t('side.mg')+'</h4>'+SIDE_MG.map(link).join('');
}
function titleKey(id){
  if(id==='home')return 'welcome.hero';
  const pg=$('#page-'+id);if(pg&&pg.dataset.title)return pg.dataset.title;
  return {dashboard:'title.dashboard',manager:'title.manager',mschedule:'title.msched',msend:'title.msend',household:'title.household'}[id]||'title.'+id;
}

function route(){
  let id=(location.hash.replace(/^#\/?/,'').split('?')[0]||'home').toLowerCase();
  const isApp=!!V[id], isPub=PUBLIC.includes(id);
  if(!isApp&&!isPub)id='404';
  const changed=id!==current;current=id;

  $$('main > .page').forEach(p=>{p.hidden=true});
  const page=isApp?$('#page-app'):$('#page-'+id);
  page.hidden=false;
  if(isApp){renderSide(id);$('#view').innerHTML=V[id]();initView($('#view'))}
  else if(id==='login'&&changed)authStep(1);

  /* Active link in header and drawer */
  const navKey=isApp?(MANAGER.includes(id)?'manager':'app'):id;
  $$('[data-nav]').forEach(a=>{
    const on=a.dataset.nav===navKey||(a.dataset.nav==='app'&&navKey==='manager'&&a.closest('.main-nav'));
    a.classList.toggle('on',!!on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');
  });
  document.title=(id==='home'?'Innboard.ai | ':'')+(id==='404'?t('nf.t'):t(titleKey(id)).replace(/<[^>]+>/g,''))+(id==='home'?'':' | Innboard.ai');

  if(changed){
    closeDrawer();window.scrollTo(0,0);if(!(first&&new URLSearchParams(location.search).get('view')==='mobile'))$('#main').focus({preventScroll:true});first=false;
    /* Page enter animation */
    const anim=isApp?$('#view'):page;anim.classList.remove('page-in');void anim.offsetWidth;anim.classList.add('page-in');
  }
  setupReveal(page);
}

/* ---------- Motion: scroll reveal, count-up, header, back to top ---------- */
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const REVEAL='.sec-head,.tile,.feat,.step3,.role,.cta-band,.card,.stat,.voice,.cta,.prio,.step-row,.plan-row,.mem,.acc';
let revealObs=null;
function setupReveal(root){
  const items=$$(REVEAL,root).filter(el=>!el.classList.contains('reveal'));
  if(reduceMotion||!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('reveal','in'));countUp(root);return}
  revealObs=revealObs||new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;en.target.classList.add('in');revealObs.unobserve(en.target);if(en.target.matches('.stat'))countUp(en.target)}),{rootMargin:'0px 0px -6% 0px',threshold:.05});
  items.forEach(el=>{
    const sibs=el.parentElement?Array.from(el.parentElement.children):[];
    el.style.setProperty('--d',Math.min(sibs.indexOf(el),8)*45+'ms');
    el.classList.add('reveal');revealObs.observe(el);
  });
}
/* Animate numbers such as 14, 96% or 9/18 */
function countUp(root){
  $$('.stat b',root.matches&&root.matches('.stat')?root.parentElement:root).forEach(b=>{
    if(b.dataset.counted)return;b.dataset.counted='1';
    const m=b.textContent.match(/^(\d+)(.*)$/);if(!m||reduceMotion)return;
    const end=+m[1],rest=m[2],t0=performance.now(),dur=700;
    const step=now=>{const k=Math.min(1,(now-t0)/dur),v=Math.round(end*(1-Math.pow(1-k,3)));b.textContent=v+rest;if(k<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  });
}
function onScroll(){
  const y=window.scrollY;
  document.body.classList.toggle('scrolled',y>8);
  const top=$('#toTop');if(top)top.classList.toggle('show',y>600);
}

/* ---------- 8. Interactions ---------- */
function openDrawer(){$('#drawer').hidden=false;$('#menuToggle').setAttribute('aria-expanded','true');document.body.classList.add('no-scroll')}
function closeDrawer(){const d=$('#drawer');if(!d||d.hidden)return;d.hidden=true;$('#menuToggle').setAttribute('aria-expanded','false');document.body.classList.remove('no-scroll')}

function initView(root){updateDone(root);updateScore(root);resetSlots()}

/* Tabs: [data-tabs] buttons switch [data-pane="group:key"] blocks */
function switchTab(btn){
  const box=btn.closest('[data-tabs]'),g=box.dataset.tabs,k=btn.dataset.tab,root=btn.closest('.scr')||document;
  $$('[data-tab]',box).forEach(x=>{x.classList.toggle('on',x===btn);x.setAttribute('aria-selected',x===btn)});
  $$('[data-pane^="'+g+':"]',root).forEach(p=>{const show=p.dataset.pane===g+':'+k;p.hidden=!show;if(show){p.classList.remove('fade-in');void p.offsetWidth;p.classList.add('fade-in');setupReveal(p)}});
}

/* Step-by-step player (cleaning standards) */
function stepGo(wrap,i){
  const cards=$$('[data-step]',wrap),n=cards.length;i=Math.max(0,Math.min(n-1,i));
  wrap.dataset.cur=i;cards.forEach((c,j)=>{c.hidden=j!==i;if(j===i){c.classList.remove('fade-in');void c.offsetWidth;c.classList.add('fade-in')}});
  $('[data-step-count]',wrap).textContent=(i+1)+' / '+n;
  $('[data-step-bar]',wrap).style.width=((i+1)/n*100)+'%';
  $$('[data-step-go]',wrap).forEach((s,j)=>{s.classList.toggle('on',j===i);s.classList.toggle('done',j<i)});
  const c=cards[i];if(c&&c.getBoundingClientRect().top<80)c.scrollIntoView({block:'start',behavior:'smooth'});
}

function updateDone(root){const c=$('[data-donecount]',root);if(c){const all=$$('.task',root);c.textContent=all.filter(x=>x.classList.contains('done')).length+' / '+all.length}}

/* Quiz score + topics to review */
function updateScore(root){
  const sc=$('[data-score]',root);if(!sc)return;
  const qs=$$('[data-quiz]',root),ans=qs.filter(q=>q.classList.contains('answered')),ok=ans.filter(q=>q.dataset.ok==='1');
  sc.textContent=ok.length+' / '+ans.length;
  if(!ans.length)return;
  const rec=$('[data-train-rec]',root),bad={};
  ans.filter(q=>q.dataset.ok!=='1').forEach(q=>{bad[q.dataset.topic]=(bad[q.dataset.topic]||0)+1});
  const top=Object.keys(bad).sort((a,b)=>bad[b]-bad[a]);
  if(!top.length){rec.innerHTML=t('ai.allRight')+' '+A('standards',t('title.standards'),'link')+'.';return}
  rec.innerHTML=t('ai.review')+' '+top.map(x=>A(TOPIC[x][1],t(TOPIC[x][0]),'link')).join(', ')+'. '+t('ai.thenNew');
}

/* ----- Chat: built-in knowledge base by keyword. Set window.InnboardAI.chat to use a live AI model. ----- */
function kbReply(kind,q){
  if(kind==='manager')return t('chat.mgrReply');
  const lists=[D().AI].concat(LANG==='ka'?[]:[DATA.ka.AI]);
  for(const list of lists)for(const [src,a] of list){try{if(new RegExp(src,'i').test(q))return a}catch(e){}}
  return t('chat.fallback');
}
let AI_IMG=null;
async function sendChat(box,text){
  text=(text||'').trim();const img=box.dataset.chat==='ai'?AI_IMG:null;
  if(!text&&!img)return;
  const msgs=$('.msgs',box),me=document.createElement('div');me.className='msg me fade-in';
  if(img){const im=document.createElement('img');im.src=img;im.alt='';me.appendChild(im)}
  me.appendChild(document.createTextNode(text||t('chat.photo')));msgs.appendChild(me);
  const inp=$('[data-chat-input]',box);if(inp)inp.value='';
  if(img){AI_IMG=null;const pv=$('[data-attach-pv]',box);if(pv)pv.hidden=true}
  const r=document.createElement('div');r.className='msg fade-in typing';r.innerHTML='<i></i><i></i><i></i>';r.setAttribute('aria-label',t('chat.thinking'));msgs.appendChild(r);
  r.scrollIntoView({block:'nearest',behavior:'smooth'});
  const hook=window.InnboardAI&&typeof window.InnboardAI.chat==='function'&&box.dataset.chat==='ai'?window.InnboardAI.chat:null;
  const done=txt=>{r.classList.remove('typing');r.textContent=txt};
  if(hook){try{done(await hook({text:text||t('ai.photoQ'),image:img,lang:LANG}));return}catch(e){}}
  setTimeout(()=>done(img&&!text?t('ai.photoHint'):kbReply(box.dataset.chat,text)),700);
}

/* ----- Photo picker: resized in the browser before use ----- */
function pickImage(cb){
  const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.setAttribute('capture','environment');
  inp.onchange=()=>{const f=inp.files&&inp.files[0];if(!f)return;
    const rd=new FileReader();
    rd.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};im.onerror=()=>toast(t('photo.readErr'));im.src=rd.result};
    rd.onerror=()=>toast(t('photo.readErr'));rd.readAsDataURL(f)};
  inp.click();
}
let SLOT={};
const resetSlots=()=>{SLOT={}};

/* ----- Photo check. window.InnboardAI.analyze({surface,product,surfaceKey,type,name,lang}) may return a verdict ----- */
async function runCheck(root,example){
  const surfBtn=$('[data-surf].on',root),typeBtn=$('[data-ptype].on',root);
  const name=(($('[data-product-name]',root)||{}).value||'').trim();
  let surf=surfBtn&&surfBtn.dataset.surf, type=typeBtn&&typeBtn.dataset.ptype;
  if(example){surf='marble';type='acid'}
  if(!type)type=detectType(name);
  if(!surf){toast(t('photo.needSurf'));return}
  if(!type){toast(t('photo.needType'));return}
  const res=$('[data-result]',root),an=$('[data-analyzing]',root),box=$('[data-analysis]',root);
  res.hidden=false;an.hidden=false;box.hidden=true;box.innerHTML='';
  res.scrollIntoView({block:'center',behavior:'smooth'});
  const photos=example?[EX_IMG]:[SLOT.surface,SLOT.product];
  const show=r=>{an.hidden=true;box.hidden=false;box.innerHTML=verdictHTML(r,photos);box.classList.remove('fade-in');void box.offsetWidth;box.classList.add('fade-in')};
  const hook=!example&&window.InnboardAI&&typeof window.InnboardAI.analyze==='function'?window.InnboardAI.analyze:null;
  if(hook){try{const r=await hook({surface:SLOT.surface||null,product:SLOT.product||null,surfaceKey:surf,type,name,lang:LANG});if(r){show(r);return}}catch(e){}}
  const r=evaluateCheck(surf,type);
  if(example){Object.assign(r,{stain:D().EXAMPLE.stain,product:D().EXAMPLE.product,active:D().EXAMPLE.active,label:t('ex.label')})}
  else if(name)r.product=name+' · '+t('pt.'+type);
  setTimeout(()=>show(r),450);
}

/* ----- Sign in: phone -> code -> role ----- */
let timerInt;
function startTimer(){
  const tm=$('[data-timer]');let s=45;tm.textContent='0:45';clearInterval(timerInt);
  timerInt=setInterval(()=>{s--;tm.textContent='0:'+String(Math.max(s,0)).padStart(2,'0');if(s<=0){clearInterval(timerInt);tm.textContent=t('otp.now');tm.dataset.ready='1'}},1000);
  delete tm.dataset.ready;
}
function authStep(n){
  const auth=$('#auth');if(!auth)return;
  $$('[data-auth]',auth).forEach(s=>{const on=s.dataset.auth===String(n);s.hidden=!on;if(on){s.classList.remove('fade-in');void s.offsetWidth;s.classList.add('fade-in')}});
  $$('.stepper i',auth).forEach((x,i)=>x.classList.toggle('on',i<n));
  clearInterval(timerInt);
  if(n===1)setTimeout(()=>$('#phone').focus(),60);
  if(n===2){
    const ph=$('#phone').value.replace(/\D/g,'');
    $('[data-phone-out]').textContent='+995 '+ph.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/,'$1 $2 $3 $4');
    $$('[data-otp] input').forEach(i=>{i.value=''});startTimer();
    setTimeout(()=>$('[data-otp] input').focus(),60);
  }
}
function authNext(n){
  if(n===2&&!/^5\d{8}$/.test($('#phone').value.replace(/\D/g,''))){fieldError($('#phone'),t('login.bad'));return}
  if(n===3&&$$('[data-otp] input').map(i=>i.value).join('').length!==4){fieldError($('[data-otp]'),t('otp.bad'));return}
  authStep(n);
}
function fieldError(el,msg){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');toast(msg)}

/* ----- Contact form. Set CONTACT_ENDPOINT to your form service URL (e.g. Formspree) to receive messages. ----- */
const CONTACT_ENDPOINT='';
function validateContact(form){
  let ok=true;
  $$('.fld',form).forEach(f=>{f.classList.remove('bad');const e=$('.err',f);if(e)e.remove()});
  const bad=(inp,msg)=>{if(ok)inp.focus();ok=false;const f=inp.closest('.fld');f.classList.add('bad');const s=document.createElement('span');s.className='err';s.textContent=msg;f.appendChild(s)};
  ['name','email','message'].forEach(n=>{const i=form.elements[n];if(!i.value.trim())bad(i,t('contact.req'))});
  const em=form.elements.email;if(em.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim()))bad(em,t('contact.badEmail'));
  return ok;
}
async function submitContact(form){
  if(!validateContact(form))return;
  const btn=$('button[type=submit]',form),label=btn.innerHTML;
  btn.disabled=true;btn.innerHTML='<span class="spin sm"></span>'+t('contact.sending');
  try{
    if(CONTACT_ENDPOINT){
      const res=await fetch(CONTACT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
      if(!res.ok)throw new Error('send');
    }else await new Promise(r=>setTimeout(r,700));
    form.hidden=true;$('#contactOk').hidden=false;$('#contactOk').classList.add('fade-in');form.reset();
  }catch(e){toast(t('contact.fail'))}
  finally{btn.disabled=false;btn.innerHTML=label}
}

/* ----- Language menu (globe icon in the header) ----- */
function toggleLangMenu(open){
  const pop=$('#langPop'),btn=$('#langToggle');if(!pop)return;
  const show=open===undefined?pop.hidden:open;
  pop.hidden=!show;btn.setAttribute('aria-expanded',show);
  if(show){const cur=$('#langPop [data-lang="'+LANG+'"]');if(cur)cur.focus()}
}

/* ----- One click handler for the whole site ----- */
document.addEventListener('click',e=>{
  const el=e.target;
  /* Globe menu: open / close */
  if(el.closest('#langToggle')){toggleLangMenu();return}
  if(!el.closest('#langMenu'))toggleLangMenu(false);
  const lang=el.closest('[data-lang]');if(lang){setLang(lang.dataset.lang);toggleLangMenu(false);return}
  const tp=el.closest('[data-theme-pick]');if(tp){setTheme(tp.dataset.themePick,true);return}
  if(el.closest('#themeToggle')){setTheme(theme()==='dark'?'light':'dark',true);return}
  if(el.closest('#menuToggle')){$('#drawer').hidden?openDrawer():closeDrawer();return}
  if(el.closest('#toTop')){window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});return}
  if(el.closest('[data-contact-again]')){$('#contactOk').hidden=true;$('#contactForm').hidden=false;return}

  const an=el.closest('[data-auth-next]');if(an){e.preventDefault();const n=+an.dataset.authNext;n===1?authStep(1):authNext(n);return}
  const rs=el.closest('[data-timer]');if(rs&&rs.dataset.ready){startTimer();toast(t('otp.resent'));return}

  const view=el.closest('#view');if(!view)return;
  const root=el.closest('.scr')||view;

  const go=el.closest('[data-go]');
  if(go&&go.dataset.go==='back'){e.preventDefault();history.length>1?history.back():(location.hash='#/dashboard');return}

  const tab=el.closest('[data-tab]');if(tab){switchTab(tab);return}
  const cat=el.closest('[data-cat-btn]');if(cat){const k=cat.dataset.catBtn;$$('[data-cat-btn]',root).forEach(x=>x.classList.toggle('on',x===cat));$$('[data-cat]',root).forEach(c=>{const show=k==='all'||c.dataset.cat===k;c.hidden=!show;if(show){c.classList.remove('fade-in');void c.offsetWidth;c.classList.add('fade-in')}});return}
  const acc=el.closest('[data-acc]');if(acc){const a=acc.closest('.acc'),o=a.classList.toggle('open');acc.setAttribute('aria-expanded',o);return}

  const sw=el.closest('[data-steps]');
  if(sw){const i=+sw.dataset.cur,n=$$('[data-step]',sw).length;
    if(el.closest('[data-step-next]')){if(i>=n-1){toast(t('std.done'));$$('[data-step-go]',sw).forEach(x=>x.classList.add('done'))}else stepGo(sw,i+1);return}
    if(el.closest('[data-step-prev]')){stepGo(sw,i-1);return}
    const sg=el.closest('[data-step-go]');if(sg){stepGo(sw,+sg.dataset.stepGo);return}}

  const chk=el.closest('[data-check]');if(chk){const on=chk.classList.toggle('done');stSet('trolley',chk.dataset.id,on);const m=$('[data-missing]',root);if(m)m.textContent=$$('[data-check]',root).filter(x=>!x.classList.contains('done')).length;return}
  const done=el.closest('[data-done]');if(done){const tk=done.closest('.task');if(tk){const on=tk.classList.toggle('done');if(tk.dataset.id)stSet('done',tk.dataset.id,on)}updateDone(root);if(done.dataset.toast)toast(done.dataset.toast);return}
  const use=el.closest('[data-useful]');if(use){const s=$('span',use),on=!use.classList.contains('on');use.classList.toggle('on',on);s.textContent=+s.textContent+(on?1:-1);stSet('useful',use.dataset.id,on);return}
  const pick=el.closest('[data-pick],[data-surf],[data-ptype]');if(pick){const g=pick.closest('[data-group]');if(g)$$('.chip',g).forEach(x=>x.classList.toggle('on',x===pick));else pick.classList.toggle('on');if(pick.dataset.ptype){const d=$('[data-detected]',root);if(d)d.hidden=true}return}

  const ask=el.closest('[data-ask]');if(ask){sendChat(ask.closest('[data-chat]'),ask.textContent);return}
  const snd=el.closest('[data-send]');if(snd){const box=snd.closest('[data-chat]');sendChat(box,$('[data-chat-input]',box).value);return}
  if(el.closest('[data-attach]')){pickImage(url=>{AI_IMG=url;const pv=$('[data-attach-pv]',root);if(pv){pv.hidden=false;$('img',pv).src=url}});return}
  if(el.closest('[data-attach-clear]')){AI_IMG=null;$('[data-attach-pv]',root).hidden=true;return}

  const slot=el.closest('[data-slot]');if(slot){pickImage(url=>{SLOT[slot.dataset.slot]=url;slot.classList.add('filled');$('img.pv',slot).src=url});return}
  if(el.closest('[data-check-run]')){runCheck(root,false);return}
  if(el.closest('[data-photo-example]')){runCheck(root,true);return}
  if(el.closest('[data-check-reset]')){$('[data-result]',root).hidden=true;$$('.chip.on',root).forEach(x=>x.classList.remove('on'));$$('.slot',root).forEach(s=>{s.classList.remove('filled');$('img.pv',s).removeAttribute('src')});resetSlots();const n=$('[data-product-name]',root);n.value='';$('[data-detected]',root).hidden=true;root.scrollIntoView({behavior:'smooth'});return}

  const ans=el.closest('[data-ans]');if(ans){const q=ans.closest('[data-quiz]');if(q.classList.contains('answered'))return;
    q.classList.add('answered');const ok=ans.dataset.ans==='1';q.dataset.ok=ok?'1':'0';ans.classList.add(ok?'right':'wrong');
    if(!ok)$$('[data-ans="1"]',q).forEach(x=>x.classList.add('right'));const ex=$('[data-expl]',q);ex.hidden=false;ex.classList.add('fade-in');updateScore(root);return}
  if(el.closest('[data-quiz-gen]')){
    /* Pick the exercise that has been shown the fewest times */
    const list=$('[data-quiz-list]',root),Q=D().QUIZ,seen=$$('[data-quiz]',list).map(x=>x.dataset.qi);
    const cnt=Q.map((x,i)=>seen.filter(s=>s==i).length),min=Math.min.apply(null,cnt),pool=Q.map((x,i)=>i).filter(i=>cnt[i]===min);
    const qi=pool[Math.floor(Math.random()*pool.length)],w=document.createElement('div');
    w.innerHTML=quizCard(Q[qi],$$('[data-quiz]',list).length,qi);const card=w.firstElementChild;list.appendChild(card);card.classList.add('fade-in');card.scrollIntoView({block:'center',behavior:'smooth'});toast(t('ai.genToast'));return}

  const pa=el.closest('[data-plan-add]');if(pa){const row=pa.closest('.plan-row'),card=row.closest('.card'),fr=$('[data-free]',card),list=$('[data-plan-list]',card),m=+row.dataset.min;
    if(fr&&+fr.dataset.free<m){toast(t('mc.noTime'));return}
    if(fr){const v=+fr.dataset.free-m;fr.dataset.free=v;fr.textContent=fmtM(v)}
    const di=+card.closest('[data-pane]').dataset.pane.replace('mday:d',''),k=+row.dataset.k,day=DAYS[di];
    if(day){day.sugg=day.sugg.filter(x=>x!==k);day.plan.push(k)}
    pa.remove();list.appendChild(row);row.classList.add('fade-in');toast(t('mc.addedT'));return}
  const shf=el.closest('[data-shift]');if(shf){const on=shf.classList.toggle('on');shf.textContent=on?'✓':'-';shf.setAttribute('aria-pressed',on);stSet('shift',shf.dataset.id,on);toast(t(on?'mc.shiftOn':'mc.shiftOff'));return}
  const sug=el.closest('[data-suggest]');if(sug){const ta=$('textarea',sug.closest('.qcard'));ta.value=sug.dataset.suggest;ta.focus();return}
  const rp=el.closest('[data-reply]');if(rp){const q=rp.closest('.qcard'),ta=$('textarea',q);if(!ta.value.trim()){fieldError(ta,t('mg.replyNeed'));return}q.classList.add('sent');rp.textContent=t('mg.sentMark');toast(t('mg.replySent'));return}
  const swi=el.closest('[data-switch]');if(swi){const on=swi.classList.toggle('on');swi.setAttribute('aria-checked',on);return}
  if(el.closest('[data-send-mgr]')){toast(t('ms.sent'));location.hash='#/manager';return}

  const ts=el.closest('[data-toast]');if(ts){toast(ts.dataset.toast);return}
});

/* Keyboard: Enter / Space activate role="button"; Enter sends chat; Escape closes the menu */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeDrawer();if(!$('#langPop').hidden){toggleLangMenu(false);$('#langToggle').focus()}}
  const el=e.target;
  if(el.matches&&el.matches('[data-chat-input]')&&e.key==='Enter'){e.preventDefault();sendChat(el.closest('[data-chat]'),el.value);return}
  if(el.id==='phone'&&e.key==='Enter'){e.preventDefault();authNext(2);return}
  if(el.closest&&el.closest('[data-otp]')&&e.key==='Backspace'&&!el.value&&el.previousElementSibling){el.previousElementSibling.focus();return}
  if((e.key==='Enter'||e.key===' ')&&el.matches&&el.matches('[role="button"]')){e.preventDefault();el.click()}
});

document.addEventListener('input',e=>{
  const el=e.target;
  /* OTP: one digit per box, auto-advance, supports paste */
  if(el.closest&&el.closest('[data-otp]')){
    const digits=el.value.replace(/\D/g,'');const boxes=$$('[data-otp] input');let i=boxes.indexOf(el);
    if(digits.length>1){digits.split('').forEach(d=>{if(boxes[i]){boxes[i].value=d;i++}});(boxes[i]||boxes[3]).focus()}
    else{el.value=digits;if(digits&&el.nextElementSibling)el.nextElementSibling.focus()}
    if(boxes.every(b=>b.value))authNext(3);
    return;
  }
  /* Phone: keep digits only, formatted 5XX XX XX XX */
  if(el.id==='phone'){const d=el.value.replace(/\D/g,'').slice(0,9);el.value=d.replace(/^(\d{3})(\d{0,2})(\d{0,2})(\d{0,2}).*/,(m,a,b,c,x)=>[a,b,c,x].filter(Boolean).join(' '));return}
  /* Photo check: detect product type from the typed name */
  if(el.matches&&el.matches('[data-product-name]')){
    const root=el.closest('.scr'),k=detectType(el.value),d=$('[data-detected]',root);
    if(k){$$('[data-ptype]',root).forEach(x=>x.classList.toggle('on',x.dataset.ptype===k));d.textContent=t('photo.detected')+': '+t('pt.'+k);d.hidden=false}else d.hidden=true;
  }
});

document.addEventListener('submit',e=>{if(e.target.id==='contactForm'){e.preventDefault();submitContact(e.target)}});
window.addEventListener('scroll',onScroll,{passive:true});
window.matchMedia('(min-width:1024px)').addEventListener('change',m=>{if(m.matches)closeDrawer()});

/* ---------- 9. Start-up ---------- */
harvestGeorgian();
setTheme(store.get(LS_THEME)==='light'?'light':'dark');
applyStatic();
renderShared();
window.addEventListener('hashchange',route);
route();
onScroll();
document.documentElement.classList.add('ready');

/* ---------- Web app (PWA) ---------- */
/* Service worker: offline support. Works on https (Vercel, GitHub Pages) and localhost. */
/* Local development (Live Server, localhost): no service worker, so edits always show right away */
const LOCAL_DEV=/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
if('serviceWorker' in navigator){
  if(LOCAL_DEV){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));if(window.caches)caches.keys().then(ks=>ks.forEach(k=>caches.delete(k)))}
  else if(location.protocol==='https:'&&!EMBEDDED_PAGE())window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
function EMBEDDED_PAGE(){return new URLSearchParams(location.search).get('view')==='mobile'}
/* Install button: shown only when the browser offers installation */
let installEvt=null;
const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
function showInstall(on){$$('[data-install]').forEach(b=>{b.hidden=!on})}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;showInstall(true)});
window.addEventListener('appinstalled',()=>{installEvt=null;showInstall(false);toast(t('pwa.done'))});
if(isIOS&&!standalone())showInstall(true);
document.addEventListener('click',async e=>{
  if(!e.target.closest('[data-install]'))return;
  if(installEvt){installEvt.prompt();const r=await installEvt.userChoice;if(r.outcome==='accepted')showInstall(false);installEvt=null}
  else if(isIOS)toast(t('pwa.ios'));
});

/* ---------- Mobile preview: the site inside a phone frame ---------- */
/* Inside the frame the page gets ?view=mobile, which hides the preview button */
const EMBEDDED=new URLSearchParams(location.search).get('view')==='mobile';
if(EMBEDDED)document.documentElement.classList.add('embedded');
function openDevice(){
  if($('#device'))return;
  const src=location.pathname+'?view=mobile'+(location.hash||'#/home');
  const d=document.createElement('div');d.id='device';d.className='device';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label',t('mobile.btn'));
  d.innerHTML='<button type="button" class="device-close icon-btn" data-device-close aria-label="'+esc(t('mobile.close'))+'">'+ic('x')+'</button>'+
    '<div class="device-stage"><div class="phone"><span class="notch"></span><iframe title="'+esc(t('mobile.btn'))+'" src="'+esc(src)+'"></iframe></div></div>';
  document.body.appendChild(d);document.body.classList.add('no-scroll');fitDevice();$$('[data-device-open]').forEach(b=>b.setAttribute('aria-pressed','true'));
  setTimeout(()=>$('.device-close',d).focus(),50);
}
function closeDevice(){const d=$('#device');if(!d)return;$$('[data-device-open]').forEach(b=>b.setAttribute('aria-pressed','false'));d.classList.add('out');document.body.classList.remove('no-scroll');setTimeout(()=>d.remove(),220);const b=$('[data-device-open]');if(b)b.focus()}
/* Scale the 390x844 phone so it always fits the window */
/* The stage takes the scaled size, so the phone always fits under the header in every browser */
function fitDevice(){
  const st=$('#device .device-stage'),ph=$('#device .phone');if(!st||!ph)return;
  const hdr=$('.site-header').offsetHeight||68;
  const k=Math.min(1,(window.innerHeight-hdr-48)/902,(window.innerWidth-40)/418);
  st.style.width=Math.floor(418*k)+'px';st.style.height=Math.floor(902*k)+'px';
  ph.style.transform='scale('+k+')';
}
window.addEventListener('resize',fitDevice);
document.addEventListener('click',e=>{
  if(e.target.closest('[data-device-open]')){$('#device')?closeDevice():openDevice();return}
  if(e.target.closest('[data-device-close]')||e.target.id==='device')closeDevice();
});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(EMBEDDED&&window.parent!==window)window.parent.postMessage('innboard:close-device','*');else closeDevice()});
window.addEventListener('message',e=>{if(e.data==='innboard:close-device')closeDevice()});

})();
