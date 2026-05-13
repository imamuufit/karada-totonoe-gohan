const LINE_URL = "https://page.line.me/948sbivq";

let deferredInstallPrompt = null;

const $ = (id) => document.getElementById(id);

const modeLabels = {
  diet: "減量に合わせて食事を整えたい",
  condition: "体調・不調を整える食事を知りたい",
  recovery: "筋トレ後の回復を助けたい",
  busy: "忙しい日の食事を整えたい"
};

const conditionAdvice = {
  "疲れ": {
    points: ["疲れやすさが気になる時は、たんぱく質・鉄・ビタミンB群を含む食品が少なくなっていないか見直してみましょう"],
    nutrients: ["たんぱく質", "鉄", "ビタミンB群"],
    foods: ["卵", "赤身肉", "まぐろ", "納豆", "豚肉", "玄米"],
    menus: [menu("豚しゃぶと温野菜のごはんセット", "豚薄切り肉、冷凍ブロッコリー、にんじん、ごはん、味噌汁", "豚肉と野菜をゆで、ごはんと味噌汁を合わせます。", "約520kcal / P32g前後 / F14g前後 / C62g前後")],
    store: ["鮭おにぎり＋ゆで卵＋具だくさん味噌汁", "サラダチキン＋もち麦おにぎり＋無糖ヨーグルト"],
    out: ["肉か魚の定食を選び、ごはんを抜きすぎない"]
  },
  "むくみ": {
    points: ["むくみが気になる時は、水分量・塩分量・カリウムを含む食品のバランスを見直してみましょう"],
    nutrients: ["カリウム", "マグネシウム", "水分"],
    foods: ["バナナ", "ほうれん草", "海藻", "豆腐", "きのこ", "じゃがいも"],
    menus: [menu("豆腐とわかめの具だくさん味噌汁定食", "豆腐、わかめ、きのこ、卵、ごはん", "味噌汁に豆腐・わかめ・きのこを入れ、卵とごはんを添えます。", "約450kcal / P24g前後 / F13g前後 / C58g前後")],
    store: ["海藻サラダ＋豆腐バー＋おにぎり", "バナナ＋焼き魚惣菜＋味噌汁"],
    out: ["汁物を全部飲み切らず、野菜や海藻の小鉢を足す"]
  },
  "便通": {
    points: ["便通が気になる時は、食物繊維・水分・発酵食品を意識したメニューがおすすめです"],
    nutrients: ["食物繊維", "発酵食品", "水分"],
    foods: ["オートミール", "納豆", "ヨーグルト", "きのこ", "海藻", "ごぼう"],
    menus: [menu("納豆オクラごはんと具だくさん味噌汁", "納豆、オクラ、もち麦ごはん、きのこ、味噌汁", "納豆とオクラをごはんにのせ、きのこ入り味噌汁を合わせます。", "約500kcal / P23g前後 / F12g前後 / C72g前後")],
    store: ["もち麦おにぎり＋ヨーグルト＋海藻サラダ", "納豆巻き＋味噌汁＋バナナ"],
    out: ["丼だけで済ませず、汁物か野菜小鉢を合わせる"]
  },
  "肌荒れ": {
    points: ["肌荒れが気になる時は、魚・卵・緑黄色野菜を含む食事が少なくなっていないか見直しましょう"],
    nutrients: ["たんぱく質", "ビタミンA", "ビタミンC", "良質な脂質"],
    foods: ["鮭", "卵", "ブロッコリー", "にんじん", "キウイ", "アボカド"],
    menus: [menu("鮭とブロッコリーの整えプレート", "鮭、ブロッコリー、にんじん、ごはん、味噌汁", "鮭を焼き、温野菜とごはんを添えます。", "約540kcal / P34g前後 / F17g前後 / C60g前後")],
    store: ["焼き魚＋ブロッコリーサラダ＋おにぎり", "ゆで卵＋無糖ヨーグルト＋果物"],
    out: ["魚定食や蒸し鶏サラダを選び、甘い飲み物を控えめにする"]
  },
  "冷え": {
    points: ["冷えが気になる日は、温かい汁物と肉魚卵などの主菜を一緒に入れてみましょう"],
    nutrients: ["たんぱく質", "鉄", "ビタミンE"],
    foods: ["赤身肉", "卵", "鮭", "かぼちゃ", "生姜", "ナッツ"],
    menus: [menu("生姜入り鶏団子スープごはん", "鶏ひき肉、生姜、白菜、きのこ、ごはん", "鶏団子を作り、野菜と一緒にスープで煮ます。", "約480kcal / P30g前後 / F12g前後 / C62g前後")],
    store: ["温かいスープ＋ゆで卵＋おにぎり", "焼き魚＋かぼちゃ惣菜＋味噌汁"],
    out: ["冷たい単品より、温かい定食や鍋系を選ぶ"]
  },
  "空腹感": {
    points: ["空腹感が強い時は、主食を抜きすぎず、たんぱく質と食物繊維で満足感を作りましょう"],
    nutrients: ["たんぱく質", "食物繊維", "適量の炭水化物"],
    foods: ["鶏むね肉", "卵", "豆腐", "もち麦", "さつまいも", "きのこ"],
    menus: [menu("鶏むねときのこの雑炊", "鶏むね肉、卵、きのこ、ごはん、ねぎ", "鶏肉ときのこを煮て、ごはんと卵を加えます。", "約460kcal / P33g前後 / F10g前後 / C58g前後")],
    store: ["おにぎり＋サラダチキン＋具だくさんスープ", "ゆで卵＋豆腐バー＋さつまいも"],
    out: ["サラダだけにせず、主菜と少量の主食を合わせる"]
  },
  "睡眠": {
    points: ["睡眠が気になる時は、夜の脂っこさを控え、温かく消化しやすい食事に寄せてみましょう"],
    nutrients: ["たんぱく質", "マグネシウム", "ビタミンB6"],
    foods: ["豆腐", "鶏肉", "鮭", "バナナ", "ほうれん草", "味噌"],
    menus: [menu("豆腐と鶏肉のあっさり鍋", "豆腐、鶏肉、白菜、きのこ、少量のごはん", "鍋に具材を入れて煮込み、少量のごはんを合わせます。", "約430kcal / P32g前後 / F13g前後 / C45g前後")],
    store: ["鮭おにぎり＋味噌汁＋豆腐バー", "バナナ＋無糖ヨーグルト＋温かいスープ"],
    out: ["揚げ物や大盛りを避け、焼き魚や鍋系にする"]
  },
  "胃もたれ": {
    points: ["胃もたれが気になる日は、脂質を控えめにして、温かくやわらかい料理を選びましょう"],
    nutrients: ["消化しやすいたんぱく質", "ビタミンB群", "水分"],
    foods: ["豆腐", "白身魚", "卵", "大根", "うどん", "鶏ささみ"],
    menus: [menu("豆腐と卵のあんかけ", "豆腐、卵、大根、だし、ごはん少量", "豆腐を温め、卵あんをかけて大根を添えます。", "約380kcal / P22g前後 / F12g前後 / C42g前後")],
    store: ["茶碗蒸し＋おでんの大根と卵", "温かいうどん＋豆腐"],
    out: ["揚げ物やこってり麺より、うどん・焼き魚・湯豆腐系を選ぶ"]
  },
  "食欲の乱れ": {
    points: ["食欲の乱れが気になる時は、食事時間と主食・主菜のバランスを整えるところから始めましょう"],
    nutrients: ["たんぱく質", "炭水化物", "食物繊維"],
    foods: ["卵", "納豆", "ごはん", "味噌汁", "野菜スープ"],
    menus: [menu("卵納豆ごはんと野菜スープ", "卵、納豆、ごはん、カット野菜、味噌", "卵と納豆をごはんにのせ、野菜スープを添えます。", "約520kcal / P26g前後 / F15g前後 / C68g前後")],
    store: ["おにぎり＋ゆで卵＋野菜スープ", "納豆巻き＋味噌汁＋ヨーグルト"],
    out: ["単品より、主食・主菜・汁物がある形を選ぶ"]
  }
};

const habitAdvice = {
  "朝食少なめ": ["朝は小さくても、卵・ヨーグルト・納豆などを1品足す"],
  "たんぱく質が少ない": ["毎食で手のひら半分から1枚分の主菜を意識する"],
  "肉魚卵が少ない": ["肉魚卵が少ない日は、豆腐・納豆・卵から足す"],
  "野菜が少ない": ["包丁を使わない冷凍野菜や汁物から足す"],
  "甘いものが多い": ["甘いものを減らす前に、食事のたんぱく質と主食を整える"],
  "揚げ物が多い": ["揚げ物の日は、次の食事を焼く・蒸す・煮るに寄せる"],
  "主食を抜きがち": ["活動量がある日は、少量の主食を戻す"],
  "水分が少ない": ["食事と一緒に、まずコップ1杯の水分を足す"],
  "塩分が多い": ["汁物や麺のスープを控えめにし、海藻や野菜を足す"],
  "脂質を避けすぎている": ["魚・卵・ナッツなどから脂質を少し戻す"],
  "食事量が少ない": ["食べやすい汁物や小さな主食から、量を少しずつ戻す"],
  "夜遅くに食べる": ["夜は脂っこさを控え、温かい軽めの主菜にする"],
  "間食が多い": ["間食の前に、食事の主菜と主食が足りているか見直す"]
};

const styleAdvice = {
  "自炊": {
    store: ["足りない時の補助として、ヨーグルト・ゆで卵・カット野菜"],
    out: ["外食時は定食型を選び、主菜と汁物をそろえる"]
  },
  "コンビニ": {
    store: ["おにぎり＋サラダチキン＋海藻サラダ", "焼き魚惣菜＋味噌汁＋もち麦おにぎり"],
    out: ["外食になった日は、揚げ物単品より定食やスープ付きにする"]
  },
  "外食多め": {
    store: ["不足分として、果物・ヨーグルト・海藻サラダを足す"],
    out: ["丼や麺だけの日は、卵・豆腐・小鉢・汁物のどれかを追加する", "大盛りより、主菜がある定食を選ぶ"]
  },
  "家族と同じ食事": {
    store: ["足りない分だけ、豆腐・納豆・カット野菜・果物を追加する"],
    out: ["家族の予定に合わせつつ、主食量と汁物で調整する"]
  }
};

function menu(name, ingredients, steps, pfc) {
  return { name, ingredients, steps, pfc };
}

function selected(name) {
  return [...document.querySelectorAll(`[name="${name}"]:checked`)].map((input) => input.value);
}

function value(id) {
  return $(id)?.value || "";
}

function numberValue(id) {
  const parsed = Number(value(id));
  return Number.isFinite(parsed) ? parsed : null;
}

function unique(items) {
  return [...new Set(items.flat().filter(Boolean))];
}

function limit(items, count) {
  return unique(items).slice(0, count);
}

function getCurrentMode() {
  return selected("mode")[0] || "diet";
}

function collectInput() {
  const mode = getCurrentMode();
  return {
    mode,
    safetyFlags: selected("safety"),
    userProfile: {
      sex: value("dietSex"),
      age: numberValue("dietAge"),
      height: numberValue("dietHeight"),
      currentWeight: numberValue("dietWeight")
    },
    dietGoal: {
      goalWeight: numberValue("dietGoalWeight"),
      periodWeeks: Number(value("dietPeriod") || 12)
    },
    activityLevel: {
      factor: Number(value("activityLevel") || 1.35),
      trainingDays: Number(value("trainingDays") || 0),
      steps: value("steps")
    },
    symptoms: selected("conditionConcern"),
    foodStyle: mode === "diet" ? selected("dietStyle")[0] : selected("conditionStyle")[0],
    habits: selected("conditionHabit"),
    recovery: {
      frequency: value("recoveryFrequency"),
      muscleSoreness: value("muscleSoreness"),
      fatigue: value("fatigueLevel"),
      sleep: value("sleepQuality"),
      protein: value("proteinFeeling"),
      carbs: value("carbPattern"),
      phase: value("phase"),
      postMeal: value("postMeal")
    },
    busy: {
      environment: selected("busyEnvironment"),
      purpose: selected("busyPurpose")[0]
    }
  };
}

function calculateDietNumbers(input) {
  const { sex, age, height, currentWeight } = input.userProfile;
  if (!age || !height || !currentWeight) return null;
  const sexAdjust = sex === "male" ? 5 : sex === "female" ? -161 : -78;
  const bmr = 10 * currentWeight + 6.25 * height - 5 * age + sexAdjust;
  const maintenance = bmr * input.activityLevel.factor;
  const goalWeight = input.dietGoal.goalWeight;
  const weeklyGap = goalWeight ? Math.max(0, currentWeight - goalWeight) / input.dietGoal.periodWeeks : 0;
  const suggestedDeficit = clamp(maintenance * 0.16 + weeklyGap * 120, 250, 520);
  const low = Math.max(1200, maintenance - suggestedDeficit - 80);
  const high = Math.max(low + 80, maintenance - suggestedDeficit + 80);
  const target = (low + high) / 2;
  const protein = currentWeight * 1.45;
  const fat = target * 0.25 / 9;
  const carbs = Math.max(80, (target - protein * 4 - fat * 9) / 4);
  return {
    maintenance: Math.round(maintenance / 10) * 10,
    low: Math.round(low / 10) * 10,
    high: Math.round(high / 10) * 10,
    target: Math.round(target / 10) * 10,
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs)
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function generateResult(input) {
  if (input.mode === "diet") return generateDietResult(input);
  if (input.mode === "condition") return generateConditionResult(input);
  if (input.mode === "recovery") return generateRecoveryResult(input);
  return generateBusyResult(input);
}

function generateDietResult(input) {
  const numbers = calculateDietNumbers(input);
  const style = input.foodStyle || "自炊";
  const menus = [
    menu("鶏むねと温野菜のごはんプレート", "鶏むね肉、冷凍ブロッコリー、きのこ、ごはん、味噌汁", "鶏むね肉を焼き、温野菜とごはんを合わせます。味噌汁を添えると満足感が出ます。", "約520kcal / P38g前後 / F12g前後 / C62g前後"),
    menu("鮭と豆腐の整え定食", "鮭、豆腐、海藻、野菜、ごはん", "鮭を焼き、豆腐と海藻の小鉢、ごはんを合わせます。", "約560kcal / P36g前後 / F18g前後 / C58g前後")
  ];
  const points = [
    "推定カロリーは開始目安です。まずは2週間、体重変化を見ながら調整しましょう",
    "主食を抜きすぎず、たんぱく質・野菜・汁物をそろえると続けやすくなります",
    `${style}が多い日は、食べ方の形を固定すると迷いにくくなります`
  ];
  if (numbers) {
    points.unshift(`あなたの推定維持カロリーは約${numbers.maintenance.toLocaleString()}kcal前後です`);
  }
  return {
    mode: "diet",
    title: "減量に合わせた整えごはん案",
    summary: "減量目的の方に向けて、推定カロリーとPFCの開始目安、今日の食事案を表示しています。",
    numbers,
    points,
    nutrients: ["たんぱく質", "食物繊維", "ビタミンB群", "適量の炭水化物", "水分"],
    foods: ["鶏むね肉", "鮭", "卵", "豆腐", "ブロッコリー", "きのこ", "もち麦ごはん", "味噌汁"],
    menus,
    storeItems: ["おにぎり＋サラダチキン＋海藻サラダ", "焼き魚惣菜＋味噌汁＋ゆで卵", "豆腐バー＋もち麦おにぎり＋カット野菜"],
    eatingOut: ["肉か魚の定食を選び、ごはん量は体重変化を見ながら調整する", "丼や麺だけの日は、卵・豆腐・野菜小鉢を足す"],
    cautions: ["カロリーを急に下げすぎない", "主食や脂質を避けすぎず、続けやすい範囲から始める", "体重管理アプリで2週間の変化を見ながら調整しましょう"],
    weightGuide: "体重管理アプリで2週間の変化を見ながら調整しましょう。7日平均が大きく動きすぎる時は、食事量や活動量を小さく見直します。"
  };
}

function generateConditionResult(input) {
  const concerns = input.symptoms.length ? input.symptoms : ["疲れ"];
  const chosen = concerns.map((item) => conditionAdvice[item]).filter(Boolean);
  const style = input.foodStyle || "自炊";
  const habits = input.habits;
  return {
    mode: "condition",
    title: "体調・不調に合わせた整えごはん案",
    summary: `${concerns.join("、")}が気になる方向けに、食事の偏りを整える候補を表示しています。`,
    numbers: null,
    points: limit([...chosen.flatMap((item) => item.points), ...habits.flatMap((item) => habitAdvice[item] || [])], 5),
    nutrients: limit(chosen.flatMap((item) => item.nutrients), 7),
    foods: limit(chosen.flatMap((item) => item.foods), 10),
    menus: limit(chosen.flatMap((item) => item.menus), 3),
    storeItems: limit([...chosen.flatMap((item) => item.store), ...(styleAdvice[style]?.store || [])], 5),
    eatingOut: limit([...chosen.flatMap((item) => item.out), ...(styleAdvice[style]?.out || [])], 5),
    cautions: limit(["食材を一度に変えすぎず、まず1つ足すところから始めましょう", "強い制限より、食事の偏りを整えることを優先しましょう", "不調が強い時や長く続く時は専門家へ相談してください"], 4),
    weightGuide: "このアプリでは今日の食べ方を決め、体重や7日平均の確認は体重管理アプリで見ると役割が分かりやすくなります。"
  };
}

function generateRecoveryResult(input) {
  const r = input.recovery;
  const points = ["トレーニング後は、たんぱく質と炭水化物を同じ食事で入れると整えやすくなります"];
  if (r.carbs.includes("控え") || r.carbs.includes("抜き")) points.push("炭水化物を控えがちな日は、ごはん・おにぎり・芋類を少量戻す候補があります");
  if (r.protein.includes("不安") || r.protein.includes("少ない")) points.push("たんぱく質源を毎食1品入れる形にすると、食事全体を組み立てやすくなります");
  if (r.postMeal.includes("取れていない")) points.push("トレーニング後に食事が難しい日は、まず飲み物や軽食で補いやすい形を作りましょう");
  return {
    mode: "recovery",
    title: "筋トレ後の回復を助ける食事案",
    summary: "トレーニング後に不足しやすい可能性がある栄養素を補いやすいメニュー候補です。",
    numbers: null,
    points,
    nutrients: ["たんぱく質", "炭水化物", "ビタミンB群", "鉄", "マグネシウム", "水分"],
    foods: ["鶏肉", "卵", "魚", "豆腐", "ごはん", "さつまいも", "バナナ", "ほうれん草"],
    menus: [
      menu("鶏むね照り焼きとごはん、野菜スープ", "鶏むね肉、ごはん、カット野菜、味噌汁", "鶏むね肉を焼き、野菜スープとごはんを合わせます。", "約560kcal / P40g前後 / F13g前後 / C65g前後"),
      menu("まぐろ丼と味噌汁", "まぐろ、卵、海苔、ごはん、味噌汁", "ごはんにまぐろと卵をのせ、味噌汁を添えます。", "約600kcal / P42g前後 / F14g前後 / C72g前後")
    ],
    storeItems: ["おにぎり＋サラダチキン＋バナナ", "ギリシャヨーグルト＋鮭おにぎり＋味噌汁", "豆腐バー＋おにぎり＋果物"],
    eatingOut: ["肉か魚の定食にして、主食を極端に減らさない", "筋トレ後はサラダ単品より、主菜と主食を合わせる"],
    cautions: ["たんぱく質だけに偏らず、動くための主食も適量入れましょう", "回復を助ける食事の候補であり、体調が強くつらい時は休養も優先しましょう"],
    weightGuide: "減量中でも、筋トレ後の食事は体重管理アプリの7日平均を見ながら主食量を調整しましょう。"
  };
}

function generateBusyResult(input) {
  const env = input.busy.environment.length ? input.busy.environment : ["コンビニ"];
  const purpose = input.busy.purpose || "減量中";
  const points = [`${env.join("、")}の日は、主食・たんぱく質・野菜系を1つずつ選ぶと整えやすくなります`];
  if (env.includes("時間がない")) points.push("忙しい日は完璧を狙わず、まずは欠けやすいたんぱく質と水分を足すことから始めましょう");
  if (env.includes("食欲がない")) points.push("食欲がない日は、温かい汁物ややわらかい主菜から試しましょう");
  return {
    mode: "busy",
    title: "忙しい日の整えごはん案",
    summary: `${env.join("、")}中心の日に、${purpose}の目的へ寄せた現実的な選び方です。`,
    numbers: null,
    points,
    nutrients: purpose === "筋トレ後" ? ["たんぱく質", "炭水化物", "水分"] : ["たんぱく質", "食物繊維", "水分", "ビタミンB群"],
    foods: ["おにぎり", "ゆで卵", "焼き魚", "豆腐", "サラダチキン", "海藻サラダ", "味噌汁", "バナナ"],
    menus: [
      menu("買うだけ整えセット", "おにぎり、ゆで卵、海藻サラダ、味噌汁", "主食・たんぱく質・野菜系・汁物を1つずつ選びます。", "約500kcal / P25g前後 / F12g前後 / C70g前後"),
      menu("胃腸にやさしい軽めセット", "茶碗蒸し、おでんの大根と卵、温かいうどん少量", "温かく脂っこくないものを組み合わせます。", "約430kcal / P22g前後 / F10g前後 / C60g前後")
    ],
    storeItems: ["おにぎり＋サラダチキン＋海藻サラダ", "焼き魚惣菜＋味噌汁＋カット野菜", "茶碗蒸し＋おでんの大根と卵"],
    eatingOut: ["定食型を選び、主菜と汁物をそろえる", "麺類なら卵や豆腐、野菜小鉢を足す", "揚げ物単品より、焼く・煮る・蒸す料理を選ぶ"],
    cautions: ["忙しい日ほど、欠食と甘い飲み物だけで済ませないようにしましょう", "完璧な自炊を目指しすぎず、買えるもので整える日を作りましょう"],
    weightGuide: "食事提案はこのアプリで決め、体重の流れは体重管理アプリで7日平均として確認しましょう。"
  };
}

function renderResults(event) {
  event.preventDefault();
  const input = collectInput();
  const resultData = generateResult(input);
  renderResultData(input, resultData);
  $("placeholderCard").hidden = true;
  $("results").hidden = false;
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResultData(input, resultData) {
  $("urgentCard").hidden = input.safetyFlags.length === 0;
  $("resultTitle").textContent = resultData.title;
  $("resultSummary").textContent = resultData.summary;
  renderDietNumbers(resultData.numbers);
  renderList("pointList", resultData.points);
  renderList("nutrientList", resultData.nutrients.map((item) => `${item}を意識`));
  renderList("foodList", resultData.foods);
  renderMenus("menuList", resultData.menus);
  renderList("storeList", resultData.storeItems);
  renderList("eatingOutList", resultData.eatingOut);
  renderList("cautionList", resultData.cautions);
  $("weightAppGuide").textContent = resultData.weightGuide;
  $("lineCopy").value = buildLineText(input, resultData);
}

function renderDietNumbers(numbers) {
  $("calorieCard").hidden = !numbers;
  if (!numbers) return;
  $("maintenanceCalories").textContent = numbers.maintenance.toLocaleString();
  $("dietCalories").textContent = `${numbers.low.toLocaleString()}から${numbers.high.toLocaleString()}`;
  $("pfcSummary").textContent = `P${numbers.protein}g / F${numbers.fat}g / C${numbers.carbs}g`;
}

function renderList(id, items) {
  $(id).innerHTML = limit(items, 8).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderMenus(id, menus) {
  $(id).innerHTML = limit(menus, 3).map((item) => `
    <div class="menu-item">
      <strong>${escapeHtml(item.name)}</strong>
      <p><span>材料</span>${escapeHtml(item.ingredients)}</p>
      <p><span>作り方</span>${escapeHtml(item.steps)}</p>
      <p><span>目安</span>${escapeHtml(item.pfc)}</p>
    </div>
  `).join("");
}

function buildLineText(input, resultData) {
  if (input.mode === "diet") return buildDietLineText(input, resultData);
  if (input.mode === "condition") return buildConditionLineText(input, resultData);
  if (input.mode === "recovery") return buildRecoveryLineText(input, resultData);
  return buildBusyLineText(input, resultData);
}

function buildDietLineText(input, resultData) {
  const n = resultData.numbers;
  return [
    "減量に合わせて食事を整えたいです。",
    `現在の体重は${input.userProfile.currentWeight || "未入力"}kg、目標体重は${input.dietGoal.goalWeight || "未入力"}kgです。`,
    `生活強度は${textOfSelect("activityLevel")}で、食事スタイルは${input.foodStyle}が多いです。`,
    n ? `アプリでは、推定維持カロリーが${n.maintenance.toLocaleString()}kcal前後、減量開始の目安が${n.low.toLocaleString()}から${n.high.toLocaleString()}kcal前後と出ました。` : "カロリー計算に必要な項目はまだ一部未入力です。",
    "この内容をもとに、私に合う食事の整え方を相談したいです。"
  ].join("\n");
}

function buildConditionLineText(input, resultData) {
  return [
    `最近、${input.symptoms.length ? input.symptoms.join("と") : "体調のゆらぎ"}が気になっています。`,
    `食事傾向としては、${input.habits.length ? input.habits.join("・") : "まだ整理できていません"}です。`,
    `アプリでは、${resultData.nutrients.slice(0, 4).join("・")}を意識した食事がおすすめと出ました。`,
    "この内容をもとに、私に合う食事の整え方を相談したいです。"
  ].join("\n");
}

function buildRecoveryLineText(input, resultData) {
  return [
    `トレーニング後の疲労感や筋肉痛の残りやすさが気になっています。`,
    `${input.recovery.frequency}トレーニングしていて、炭水化物は${input.recovery.carbs}です。`,
    `アプリでは、${resultData.nutrients.slice(0, 4).join("・")}を意識した食事がおすすめと出ました。`,
    "回復を考えた食事の整え方を相談したいです。"
  ].join("\n");
}

function buildBusyLineText(input, resultData) {
  return [
    `今日は${input.busy.environment.length ? input.busy.environment.join("・") : "自炊が難しい"}中心になりそうです。`,
    `今日の目的は${input.busy.purpose}です。`,
    "アプリでは、主食・たんぱく質・野菜系を組み合わせる提案が出ました。",
    "今日の食事をなるべく整える選び方を相談したいです。"
  ].join("\n");
}

function textOfSelect(id) {
  const select = $(id);
  return select?.options[select.selectedIndex]?.text || "";
}

function setupModeSwitching() {
  document.querySelectorAll('[name="mode"]').forEach((input) => {
    input.addEventListener("change", () => {
      const mode = getCurrentMode();
      document.querySelectorAll(".mode-panel").forEach((panel) => panel.classList.remove("active"));
      $(`panel-${mode}`).classList.add("active");
      $("results").hidden = true;
      $("placeholderCard").hidden = false;
    });
  });
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setupEvents() {
  setupModeSwitching();
  $("advisorForm").addEventListener("submit", renderResults);
  $("copyButton").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("lineCopy").value);
      showToast("LINE相談用コピー文をコピーしました");
    } catch {
      $("lineCopy").select();
      showToast("コピーできない場合は、文章を選択してコピーしてください");
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $("installButton").hidden = false;
  });

  $("installButton").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $("installButton").hidden = true;
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("service-worker.js");
  } catch {
    console.info("Service worker registration skipped.");
  }
}

setupEvents();
registerServiceWorker();
