export const DEFAULT_LANGUAGE = 'en' as const;
export const OTHER_LANGUAGES = ['zh', 'vi', 'fr', 'ja', 'id', 'ru', 'az'] as const;
export type AllLanguage = typeof DEFAULT_LANGUAGE | (typeof OTHER_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<AllLanguage, string> = {
  en: 'English',
  zh: '中文',
  vi: 'Tiếng Việt',
  fr: 'Français',
  ja: '日本語',
  id: 'Indonesian',
  ru: 'Русский',
  az: 'Azərbaycanca',
};

// TODO: Depending on language requirement, we might need a library that supports pluralization
export const i18n: Record<string, { [key in (typeof OTHER_LANGUAGES)[number]]?: string }> = {
  [`Connecting...`]: {
    zh: `连接中...`,
    vi: `Đang kết nối...`,
    fr: `Connexion...`,
    ja: `接続中...`,
    id: `Sedang menghubungkan...`,
    ru: `Подключение...`,
    az: `Qoşulur...`,
  },
  [`Connect Wallet`]: {
    zh: `连接钱包`,
    vi: `Kết nối ví`,
    fr: `Connecter le portefeuille`,
    ja: `ウォレットに接続する`,
    id: `Hubungkan dompet`,
    ru: `Подключить кошелек`,
    az: `Pul kisəsinə qoş`,
  },
  [`Connect`]: {
    zh: `连接`,
    vi: `Kết nối`,
    fr: `Connecter`,
    ja: `接続`,
    id: `Hubungkan`,
    ru: `Подключить`,
    az: `Qoş`,
  },

  [`You need to connect a Solana wallet.`]: {
    zh: `您需要连接一个 Solana 钱包。`,
    vi: `Bạn cần kết nối ví Solana.`,
    fr: `Vous devez connecter un portefeuille Solana.`,
    ja: `Solanaウォレットを接続する必要があります。`,
    id: `Anda perlu menghubungkan dompet Solana.`,
    ru: `Вам нужно подключить кошелек Solana.`,
    az: `Siz Solana pul kisəsinə qoşulmusunuz.`,
  },
  [`New here?`]: {
    zh: `新来的？`,
    vi: `Mới đến?`,
    fr: `Nouveau ici?`,
    ja: `初めてですか？`,
    id: `Baru disini?`,
    ru: `Новичок?`,
    az: `Burada yenisiniz?`,
  },
  [`Welcome to DeFi! Create a crypto wallet to get started!`]: {
    zh: `欢迎来到 DeFi！创建一个加密钱包吧！`,
    vi: `Chào mừng đến với DeFi! Tạo ví crypto để bắt đầu!`,
    fr: `Bienvenue dans DeFi! Créez un portefeuille crypto pour commencer!`,
    ja: `DeFiへようこそ！暗号ウォレットを作成して始めましょう！`,
    id: `Selamat datang di DeFi! Buat dompet crypto untuk memulai!`,
    ru: `Добро пожаловать в DeFi! Создайте криптокошелек, чтобы начать!`,
    az: `DeFi-a xoş gəlmisiniz! Başlamaq üçün kripto pul kisəsi yaradın!`,
  },
  [`Get Started`]: {
    zh: `开始`,
    vi: `Bắt đầu`,
    fr: `Commencer`,
    ja: `始める`,
    id: `Mulai`,
    ru: `Начать`,
    az: `Başlayın`,
  },
  [`Popular wallets to get started`]: {
    zh: `热门钱包`,
    vi: `Ví phổ biến để bắt đầu`,
    fr: `Portefeuilles populaires pour commencer`,
    ja: `始める人気のウォレット`,
    id: `Dompet populer untuk memulai`,
    ru: `Популярные кошельки для начала`,
    az: `Başlamaq üçün məşhur pul kisələri`,
  },
  [`More wallets`]: {
    zh: `更多钱包`,
    vi: `Thêm ví`,
    fr: `Plus de portefeuilles`,
    ja: `その他のウォレット`,
    id: `Dompet lainnya`,
    ru: `Другие кошельки`,
    az: `Daha çox pul kisəsi`,
  },
  [`Once installed, refresh this page`]: {
    zh: `安装后，请刷新此页面`,
    vi: `Sau khi cài đặt, làm mới trang này`,
    fr: `Une fois installé, rafraîchissez cette page`,
    ja: `インストールしたら、このページを更新してください`,
    id: `Setelah diinstal, segarkan halaman ini`,
    ru: `После установки обновите эту страницу`,
    az: `Quraşdırdıqdan sonra bu səhifəni yeniləyin`,
  },
  [`Go back`]: {
    zh: `返回`,
    vi: `Quay lại`,
    fr: `Retourner`,
    ja: `戻る`,
    id: `Kembali`,
    ru: `Назад`,
    az: `Geri qayıt`,
  },
  [`Recently used`]: {
    zh: `最近使用`,
    vi: `Đã sử dụng gần đây`,
    fr: `Utilisé récemment`,
    ja: `最近使用した`,
    id: `Baru saja digunakan`,
    ru: `Недавно использованные`,
    az: `Axırıncı istifadə olunan`,
  },
  [`Recommended wallets`]: {
    zh: `推荐钱包`,
    vi: `Ví được đề xuất`,
    fr: `Portefeuilles recommandés`,
    ja: `おすすめのウォレット`,
    id: `Dompet yang direkomendasikan`,
    ru: `Рекомендуемые кошельки`,
    az: `Tövsiyə olunan pul kisələri`,
  },
  [`Installed wallets`]: {
    zh: `已安装钱包`,
    vi: `Các ví đã cài đặt`,
    fr: `Portefeuilles installés`,
    ja: `インストール済みのウォレット`,
    id: `Dompet yang diinstal`,
    ru: `Установленные кошельки`,
    az: `Quraşdırılmış pul kisələri`,
  },
  [`Popular wallets`]: {
    zh: `热门钱包`,
    vi: `Ví phổ biến`,
    fr: `Portefeuilles populaires`,
    ja: `人気のウォレット`,
    id: `Dompet populer`,
    ru: `Популярные кошельки`,
    az: `Məhşur pul kisələri`,
  },
  [`Can't find your wallet?`]: {
    zh: `找不到您的钱包？`,
    vi: `Không tìm thấy ví của bạn?`,
    fr: `Vous ne trouvez pas votre portefeuille?`,
    ja: `ウォレットが見つかりませんか？`,
    id: `Tidak dapat menemukan dompet Anda?`,
    ru: `Не можете найти свой кошелек?`,
    az: `Pul kisənizi tapa bilmirsiniz?`,
  },
  [`I don't have a wallet`]: {
    zh: `我没有钱包`,
    vi: `Tôi không có ví`,
    fr: `Je n'ai pas de portefeuille`,
    ja: `私はウォレットを持っていません`,
    id: `Saya tidak punya dompet`,
    ru: `У меня нет кошелька`,
    az: `Pul kisəm yoxdur`,
  },
  [`Have you installed`]: {
    zh: `您是否已安装`,
    vi: `Bạn đã cài đặt`,
    fr: `Avez-vous installé`,
    ja: `インストールしましたか`,
    id: `Apakah Anda sudah menginstal`,
    ru: `Вы установили`,
    az: `Quraşdırmısınız`,
  },
  [`Install`]: {
    zh: `安装`,
    vi: `Cài đặt`,
    fr: `Installer`,
    ja: `インストール`,
    id: `Memasang`,
    ru: `Установить`,
    az: `Quraşdırın`,
  },
  [`On mobile:`]: {
    zh: `在手机上：`,
    vi: `Trên điện thoại:`,
    fr: `Sur mobile:`,
    ja: `モバイル：`,
    id: `Di ponsel:`,
    ru: `На мобильном:`,
    az: `Mobil telefonda:`,
  },
  [`You should open the app instead`]: {
    zh: `您应该打开应用程序`,
    vi: `Bạn nên mở ứng dụng thay vì`,
    fr: `Vous devriez ouvrir l'application à la place`,
    ja: `代わりにアプリを開く必要があります`,
    id: `Anda harus membuka aplikasi bukannya`,
    ru: `Вместо этого вы должны открыть приложение`,
    az: `Bunun əvəzinə tətbiqi açmalısınız`,
  },
  [`On desktop:`]: {
    zh: `在桌面上：`,
    vi: `Trên máy tính để bàn:`,
    fr: `Sur ordinateur:`,
    ja: `デスクトップ：`,
    id: `Di desktop:`,
    ru: `На рабочем столе:`,
    az: `İş masasında:`,
  },
  [`Install and refresh the page`]: {
    zh: `安装并刷新页面`,
    vi: `Cài đặt và làm mới trang`,
    fr: `Installez et actualisez la page`,
    ja: `インストールしてページを更新する`,
    id: `Pasang dan segarkan halaman`,
    ru: `Установите и обновите страницу`,
    az: `Quraşdırın və səhifəni yeniləyin`,
  },
};
