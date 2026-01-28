const VOCABULARY = {
    "greetings": [
        { "kanji": "今日（こん）日は", "romaji": "Konnichiwa", "english": "Hello / Good afternoon" },
        { "kanji": "お早（はよ）う", "romaji": "Ohayou", "english": "Good morning (casual)" },
        { "kanji": "お早（はよ）う御座（ござ）います", "romaji": "Ohayou gozaimasu", "english": "Good morning (polite)" },
        { "kanji": "今晩（こんばん）は", "romaji": "Konbanwa", "english": "Good evening" },
        { "kanji": "お休（やす）みなさい", "romaji": "Oyasuminasai", "english": "Good night" },
        { "kanji": "然様（さよう）なら", "romaji": "Sayounara", "english": "Goodbye" },
        { "kanji": "じゃあね", "romaji": "Jaa ne", "english": "See you (casual)" },
        { "kanji": "またね", "romaji": "Mata ne", "english": "See you later" },
        { "kanji": "行（い）って来（き）ます", "romaji": "Ittekimasu", "english": "I'm leaving" },
        { "kanji": "行（い）ってらっしゃい", "romaji": "Itterasshai", "english": "Take care" },
        { "kanji": "唯今（ただいま）", "romaji": "Tadaima", "english": "I'm home" },
        { "kanji": "御（お）帰（かえ）りなさい", "romaji": "Okaerinasai", "english": "Welcome home" }
    ],
    "common_phrases": [
        { "kanji": "有（あ）り難（がと）う", "romaji": "Arigatou", "english": "Thank you (casual)" },
        { "kanji": "有り難う御座います", "romaji": "Arigatou gozaimasu", "english": "Thank you (polite)" },
        { "kanji": "如何（どう）致（いた）しまして", "romaji": "Dou itashimashite", "english": "You're welcome" },
        { "kanji": "済（す）みません", "romaji": "Sumimasen", "english": "Excuse me / Sorry" },
        { "kanji": "御免（ごめん）なさい", "romaji": "Gomen nasai", "english": "I'm sorry" },
        { "kanji": "はい", "romaji": "Hai", "english": "Yes" },
        { "kanji": "いいえ", "romaji": "Iie", "english": "No" },
        { "kanji": "御願（ねが）いします", "romaji": "Onegaishimasu", "english": "Please" },
        { "kanji": "分（わ）かりました", "romaji": "Wakarimashita", "english": "I understand" },
        { "kanji": "分かりません", "romaji": "Wakarimasen", "english": "I don't understand" },
        { "kanji": "日本語が分かりません", "romaji": "Nihongo ga wakarimasen", "english": "I don't understand Japanese" },
        { "kanji": "英語（えいご）を話（はな）せますか", "romaji": "Eigo wo hanasemasu ka", "english": "Do you speak English?" },
        { "kanji": "もう一（いち）度（ど）御願いします", "romaji": "Mou ichido onegaishimasu", "english": "Once more, please" },
        { "kanji": "ゆっくり話してください", "romaji": "Yukkuri hanashite kudasai", "english": "Please speak slowly" }
    ],
    "questions": [
        { "kanji": "これはなんですか？", "romaji": "Kore wa nan desu ka?", "english": "What is this?" },
        { "kanji": "それはなんですか？", "romaji": "Sore wa nan desu ka?", "english": "What is that?" },
        { "kanji": "どこですか？", "romaji": "Doko desu ka?", "english": "Where is it?" },
        { "kanji": "いくらですか？", "romaji": "Ikura desu ka?", "english": "How much is it?" },
        { "kanji": "だれですか？", "romaji": "Dare desu ka?", "english": "Who is it?" },
        { "kanji": "いつですか？", "romaji": "Itsu desu ka?", "english": "When is it?" }
    ],
    "numbers": [
        { "kanji": "一", "romaji": "Ichi", "english": "One (1)" },
        { "kanji": "二", "romaji": "Ni", "english": "Two (2)" },
        { "kanji": "三", "romaji": "San", "english": "Three (3)" },
        { "kanji": "四", "romaji": "Yon", "english": "Four (4)" },
        { "kanji": "五", "romaji": "Go", "english": "Five (5)" },
        { "kanji": "六", "romaji": "Roku", "english": "Six (6)" },
        { "kanji": "七", "romaji": "Nana", "english": "Seven (7)" },
        { "kanji": "八", "romaji": "Hachi", "english": "Eight (8)" },
        { "kanji": "九", "romaji": "Kyuu", "english": "Nine (9)" },
        { "kanji": "十", "romaji": "Juu", "english": "Ten (10)" }
    ],
    "food_and_drink": [
        { "kanji": "水", "romaji": "Mizu", "english": "Water" },
        { "kanji": "お茶", "romaji": "Ocha", "english": "Tea" },
        { "kanji": "コーヒー", "romaji": "Koohii", "english": "Coffee" },
        { "kanji": "ご飯", "romaji": "Gohan", "english": "Rice / Meal" },
        { "kanji": "パン", "romaji": "Pan", "english": "Bread" },
        { "kanji": "肉", "romaji": "Niku", "english": "Meat" },
        { "kanji": "魚", "romaji": "Sakana", "english": "Fish" },
        { "kanji": "野菜", "romaji": "Yasai", "english": "Vegetables" },
        { "kanji": "果物", "romaji": "Kudamono", "english": "Fruit" },
        { "kanji": "寿司", "romaji": "Sushi", "english": "Sushi" },
        { "kanji": "ラーメン", "romaji": "Raamen", "english": "Ramen" },
        { "kanji": "美味しい", "romaji": "Oishii", "english": "Delicious" }
    ]
};

const CONVERSATIONS = {
    "patterns": [
        {
            "triggers": ["konnichiwa", "こんにちは", "hello", "hi"],
            "responses": [
                { "japanese": "こんにちは！元気ですか？", "romaji": "Konnichiwa! Genki desu ka?", "english": "Hello! How are you?" },
                { "japanese": "こんにちは！今日は良い天気ですね。", "romaji": "Konnichiwa! Kyou wa yoi tenki desu ne.", "english": "Hello! It's nice weather today, isn't it?" }
            ]
        },
        {
            "triggers": ["ohayou", "おはよう", "good morning", "morning"],
            "responses": [
                { "japanese": "おはようございます！良く眠れましたか？", "romaji": "Ohayou gozaimasu! Yoku nemuremashita ka?", "english": "Good morning! Did you sleep well?" },
                { "japanese": "おはよう！今日も頑張りましょう！", "romaji": "Ohayou! Kyou mo ganbarimashou!", "english": "Morning! Let's do our best today too!" }
            ]
        },
        {
            "triggers": ["konbanwa", "こんばんは", "good evening", "evening"],
            "responses": [
                { "japanese": "こんばんは！今日（きょう）はどうでしたか？", "romaji": "Konbanwa! Kyou wa dou deshita ka?", "english": "Good evening! How was your day?" },
                { "japanese": "こんばんは！お疲れ様でした。", "romaji": "Konbanwa! Otsukaresama deshita.", "english": "Good evening! Thanks for your hard work today." }
            ]
        },
        {
            "triggers": ["genki", "元気", "how are you", "how's it going"],
            "responses": [
                { "japanese": "元気（げんき）ですよ！あなたは？", "romaji": "Genki desu yo! Anata wa?", "english": "I'm fine! And you?" },
                { "japanese": "はい、元気です。有り難う！", "romaji": "Hai, genki desu. Arigatou!", "english": "Yes, I'm well. Thank you!" },
                { "japanese": "まあまあです。", "romaji": "Maa maa desu.", "english": "So-so." }
            ]
        },
        {
            "triggers": ["arigatou", "ありがとう", "thank you", "thanks"],
            "responses": [
                { "japanese": "どういたしまして！", "romaji": "Dou itashimashite!", "english": "You're welcome!" },
                { "japanese": "いいえ、こちらこそ。", "romaji": "Iie, kochira koso.", "english": "No, thank you (lit. 'this side too')." }
            ]
        },
        {
            "triggers": ["sumimasen", "すみません", "excuse me", "sorry"],
            "responses": [
                { "japanese": "大丈夫（だいじょうぶ）ですよ！", "romaji": "Daijoubu desu yo!", "english": "It's okay!" },
                { "japanese": "いいえ、気にしないでください。", "romaji": "Iie, ki ni shinaide kudasai.", "english": "No, please don't worry about it." }
            ]
        },
        {
            "triggers": ["hajimemashite", "はじめまして", "nice to meet you"],
            "responses": [
                { "japanese": "はじめまして！宜しくお願いします。", "romaji": "Hajimemashite! Yoroshiku onegaishimasu.", "english": "Nice to meet you! Please treat me well." },
                { "japanese": "こちらこそ、宜しくお願いします！", "romaji": "Kochira koso, yoroshiku onegaishimasu!", "english": "Likewise, pleased to meet you!" }
            ]
        },
        {
            "triggers": ["namae", "名前", "name", "what is your name", "who are you"],
            "responses": [
                { "japanese": "私は日本語（にほんご）教師（きょうし）です。お名前は？", "romaji": "Watashi wa nihongo kyoushi desu. Onamae wa?", "english": "I am a Japanese teacher. What is your name?" },
                { "japanese": "名前は「日本語ヘルパー」です！", "romaji": "Namae wa 'Nihongo Herupaa' desu!", "english": "My name is 'Japanese Helper'!" }
            ]
        },
        {
            "triggers": ["sayounara", "さようなら", "goodbye", "bye"],
            "responses": [
                { "japanese": "左様（さよう）なら！また会いましょう！", "romaji": "Sayounara! Mata aimashou!", "english": "Goodbye! Let's meet again!" },
                { "japanese": "じゃあね！頑張ってね！", "romaji": "Jaa ne! Ganbatte ne!", "english": "See you! Do your best!" }
            ]
        },
        {
            "triggers": ["suki", "好き", "like", "love"],
            "responses": [
                { "japanese": "私も好（す）きです！", "romaji": "Watashi mo suki desu!", "english": "I like it too!" },
                { "japanese": "何が一番好きですか？", "romaji": "Nani ga ichiban suki desu ka?", "english": "What do you like the most?" }
            ]
        },
        {
            "triggers": ["muzukashii", "難しい", "むずかしい", "difficult", "hard"],
            "responses": [
                { "japanese": "大丈夫！練習（れんしゅう）すれば上手（じょうず）になりますよ。", "romaji": "Daijoubu! Renshuu sureba jouzu ni narimasu yo.", "english": "It's okay! If you practice, you'll get better." },
                { "japanese": "日本語は難（むずか）しいですが、楽（たの）しいですね！", "romaji": "Nihongo wa muzukashii desu ga, tanoshii desu ne!", "english": "Japanese is difficult, but it's fun, isn't it!" }
            ]
        },
        {
            "triggers": ["tanoshii", "楽しい", "たのしい", "fun", "enjoy", "enjoying"],
            "responses": [
                { "japanese": "楽しいですね！日本語の勉強を続けましょう！", "romaji": "Tanoshii desu ne! Nihongo no benkyou wo tsuzukemashou!", "english": "It's fun, isn't it! Let's continue studying Japanese!" },
                { "japanese": "それはよかったです！", "romaji": "Sore wa yokatta desu!", "english": "That's great!" }
            ]
        },
        {
            "triggers": ["oyasumi", "おやすみ", "good night", "night", "goodnight"],
            "responses": [
                { "japanese": "おやすみなさい！いい夢を！", "romaji": "Oyasuminasai! Ii yume wo!", "english": "Good night! Sweet dreams!" },
                { "japanese": "おやすみ！ゆっくり休んでね。", "romaji": "Oyasumi! Yukkuri yasunde ne.", "english": "Night! Rest well." }
            ]
        },
        {
            "triggers": ["kawaii", "かわいい", "可愛い", "cute", "adorable"],
            "responses": [
                { "japanese": "かわいいですね！", "romaji": "Kawaii desu ne!", "english": "It's cute, isn't it!" },
                { "japanese": "とてもかわいい！", "romaji": "Totemo kawaii!", "english": "So cute!" }
            ]
        },
        {
            "triggers": ["sugoi", "すごい", "凄い", "amazing", "awesome", "wow", "cool"],
            "responses": [
                { "japanese": "本当にすごいですね！", "romaji": "Hontou ni sugoi desu ne!", "english": "It's really amazing!" },
                { "japanese": "すごい！よくできました！", "romaji": "Sugoi! Yoku dekimashita!", "english": "Amazing! Well done!" }
            ]
        },
        {
            "triggers": ["tsukareta", "疲れた", "つかれた", "tired", "exhausted"],
            "responses": [
                { "japanese": "お疲れ様です。少し休んでください。", "romaji": "Otsukaresama desu. Sukoshi yasunde kudasai.", "english": "Thanks for your hard work. Please rest a bit." },
                { "japanese": "大変でしたね。ゆっくり休んでね。", "romaji": "Taihen deshita ne. Yukkuri yasunde ne.", "english": "That was tough, wasn't it. Take it easy." }
            ]
        },
        {
            "triggers": ["wakaranai", "wakarimasen", "わからない", "わかりません", "分からない", "don't understand", "confused", "dont understand"],
            "responses": [
                { "japanese": "大丈夫ですよ。もう一度説明しましょうか？", "romaji": "Daijoubu desu yo. Mou ichido setsumei shimashou ka?", "english": "It's okay. Shall I explain again?" },
                { "japanese": "ゆっくり練習しましょう。", "romaji": "Yukkuri renshuu shimashou.", "english": "Let's practice slowly." }
            ]
        },
        {
            "triggers": ["nihongo", "にほんご", "日本語", "japanese", "japan"],
            "responses": [
                { "japanese": "日本語を勉強していますか？すごいですね！", "romaji": "Nihongo wo benkyou shite imasu ka? Sugoi desu ne!", "english": "Are you studying Japanese? That's amazing!" },
                { "japanese": "日本語は美しい言語ですね。", "romaji": "Nihongo wa utsukushii gengo desu ne.", "english": "Japanese is a beautiful language, isn't it." }
            ]
        },
        {
            "triggers": ["benkyou", "べんきょう", "勉強", "study", "studying", "learn", "learning"],
            "responses": [
                { "japanese": "勉強頑張ってね！", "romaji": "Benkyou ganbatte ne!", "english": "Good luck with your studies!" },
                { "japanese": "毎日少しずつ勉強するのが大切ですよ。", "romaji": "Mainichi sukoshi zutsu benkyou suru no ga taisetsu desu yo.", "english": "It's important to study a little bit every day." }
            ]
        },
        {
            "triggers": ["oishii", "おいしい", "美味しい", "delicious", "yummy", "tasty"],
            "responses": [
                { "japanese": "本当ですか？よかったです！", "romaji": "Hontou desu ka? Yokatta desu!", "english": "Really? I'm glad!" },
                { "japanese": "日本料理は美味しいですね！", "romaji": "Nihon ryouri wa oishii desu ne!", "english": "Japanese food is delicious, isn't it!" }
            ]
        },
        {
            "triggers": ["taberu", "たべる", "食べる", "eat", "eating", "food", "hungry"],
            "responses": [
                { "japanese": "何を食べたいですか？", "romaji": "Nani wo tabetai desu ka?", "english": "What would you like to eat?" },
                { "japanese": "ご飯を食べましょう！", "romaji": "Gohan wo tabemashou!", "english": "Let's eat a meal!" }
            ]
        },
        {
            "triggers": ["daijoubu", "だいじょうぶ", "大丈夫", "okay", "alright", "fine", "im okay", "i'm okay"],
            "responses": [
                { "japanese": "よかったです！", "romaji": "Yokatta desu!", "english": "That's good!" },
                { "japanese": "安心しました！", "romaji": "Anshin shimashita!", "english": "I'm relieved!" }
            ]
        },
        {
            "triggers": ["help", "tasukete", "たすけて", "助けて"],
            "responses": [
                { "japanese": "はい、何をお手伝いしましょうか？", "romaji": "Hai, nani wo otetsudai shimashou ka?", "english": "Yes, how can I help you?" },
                { "japanese": "どうしましたか？", "romaji": "Dou shimashita ka?", "english": "What happened?" }
            ]
        },
        {
            "triggers": ["yes", "hai", "はい", "yeah", "yep", "yea"],
            "responses": [
                { "japanese": "そうですか。いいですね！", "romaji": "Sou desu ka. Ii desu ne!", "english": "I see. That's good!" },
                { "japanese": "わかりました！", "romaji": "Wakarimashita!", "english": "Understood!" }
            ]
        },
        {
            "triggers": ["no", "iie", "いいえ", "nope", "nah"],
            "responses": [
                { "japanese": "そうですか。大丈夫ですよ。", "romaji": "Sou desu ka. Daijoubu desu yo.", "english": "I see. It's okay." },
                { "japanese": "わかりました。", "romaji": "Wakarimashita.", "english": "Understood." }
            ]
        }
    ],
    "default_responses": [
        { "japanese": "なるほど。もっと教（おし）えてください。", "romaji": "Naruhodo. Motto oshiete kudasai.", "english": "I see. Please tell me more." },
        { "japanese": "面白（おもしろ）いですね！", "romaji": "Omoshiroi desu ne!", "english": "That's interesting!" },
        { "japanese": "日本語でお話（はな）しましょう！", "romaji": "Nihongo de ohanashimashou!", "english": "Let's try speaking in Japanese!" },
        { "japanese": "もう一（いち）度（ど）お願（ねが）いします。", "romaji": "Mou ichido onegaishimasu.", "english": "Once more, please." },
        { "japanese": "そうですか。", "romaji": "Sou desu ka.", "english": "Is that so?" },
        { "japanese": "面白いですね。続けてください！", "romaji": "Omoshiroi desu ne. Tsuzukete kudasai!", "english": "That's interesting. Please continue!" }
    ]
};
