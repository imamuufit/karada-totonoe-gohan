const LINE_URL = "https://page.line.me/948sbivq";

let deferredInstallPrompt = null;

const $ = (id) => document.getElementById(id);

const adviceBase = {
  concerns: {
    "疲れ": {
      points: ["朝か昼に、たんぱく質と主食をセットで入れる"],
      nutrients: ["たんぱく質", "鉄", "ビタミンB群"],
      foods: ["卵", "赤身肉", "まぐろ", "納豆", "玄米", "豚肉"],
      menus: ["豚しゃぶと温野菜のごはんセット", "卵と納豆の雑穀ごはん"],
      store: ["ゆで卵", "サラダチキン", "鮭おにぎり", "具だくさん味噌汁"],
      out: ["定食で肉か魚の主菜を選び、ごはんを抜きすぎない"]
    },
    "むくみ": {
      points: ["塩分が多い日は、水分とカリウムを含む食材を足す"],
      nutrients: ["カリウム", "マグネシウム", "水分"],
      foods: ["バナナ", "ほうれん草", "海藻", "豆腐", "きのこ", "じゃがいも"],
      menus: ["豆腐とわかめの味噌汁、焼き魚、雑穀ごはん", "きのことほうれん草の卵炒め"],
      store: ["海藻サラダ", "バナナ", "豆腐バー", "無糖のお茶"],
      out: ["汁物を全部飲み切らず、野菜や海藻の小鉢を足す"]
    },
    "便通": {
      points: ["食物繊維だけでなく、水分と油を少し入れる"],
      nutrients: ["食物繊維", "発酵食品", "水分"],
      foods: ["オートミール", "納豆", "ヨーグルト", "きのこ", "海藻", "ごぼう"],
      menus: ["納豆オクラごはんと具だくさん味噌汁", "きのこと鶏肉のスープ"],
      store: ["ヨーグルト", "もち麦おにぎり", "海藻サラダ", "味噌汁"],
      out: ["丼だけで済ませず、汁物か野菜小鉢を合わせる"]
    },
    "肌荒れ": {
      points: ["甘いものや揚げ物が続く日は、魚・卵・緑黄色野菜を足す"],
      nutrients: ["たんぱく質", "ビタミンA", "ビタミンC", "良質な脂質"],
      foods: ["鮭", "卵", "ブロッコリー", "にんじん", "キウイ", "アボカド"],
      menus: ["鮭とブロッコリーのプレート", "卵とにんじんのスープ"],
      store: ["焼き魚", "ゆで卵", "ブロッコリーサラダ", "無糖ヨーグルト"],
      out: ["魚定食や蒸し鶏サラダを選び、甘い飲み物を控えめにする"]
    },
    "冷え": {
      points: ["温かい汁物と、肉魚卵などの主菜を一緒に入れる"],
      nutrients: ["たんぱく質", "鉄", "ビタミンE"],
      foods: ["赤身肉", "卵", "鮭", "かぼちゃ", "生姜", "ナッツ"],
      menus: ["生姜入り鶏団子スープ", "鮭とかぼちゃの味噌汁定食"],
      store: ["温かいスープ", "焼き魚", "ゆで卵", "ナッツ"],
      out: ["冷たい単品より、温かい定食や鍋系を選ぶ"]
    },
    "空腹感": {
      points: ["主食を抜きすぎず、たんぱく質と食物繊維で満足感を作る"],
      nutrients: ["たんぱく質", "食物繊維", "適量の炭水化物"],
      foods: ["鶏むね肉", "卵", "豆腐", "もち麦", "さつまいも", "きのこ"],
      menus: ["鶏むねときのこの雑炊", "豆腐ハンバーグともち麦ごはん"],
      store: ["おにぎり", "サラダチキン", "具だくさんスープ", "ゆで卵"],
      out: ["サラダだけにせず、主菜と少量の主食を合わせる"]
    },
    "睡眠": {
      points: ["夜は脂っこさを控え、温かく消化しやすい食事に寄せる"],
      nutrients: ["たんぱく質", "マグネシウム", "ビタミンB6"],
      foods: ["豆腐", "鶏肉", "鮭", "バナナ", "ほうれん草", "味噌"],
      menus: ["豆腐と鶏肉のあっさり鍋", "鮭とほうれん草の味噌汁定食"],
      store: ["豆腐バー", "鮭おにぎり", "味噌汁", "バナナ"],
      out: ["揚げ物や大盛りを避け、焼き魚や鍋系にする"]
    },
    "筋肉痛": {
      points: ["トレーニング後は、たんぱく質と主食を同じ食事で入れる"],
      nutrients: ["たんぱく質", "炭水化物", "ビタミンC"],
      foods: ["鶏肉", "卵", "魚", "米", "じゃがいも", "キウイ"],
      menus: ["鶏むね照り焼きとごはん、野菜スープ", "まぐろ丼と味噌汁"],
      store: ["おにぎり", "サラダチキン", "ギリシャヨーグルト", "果物"],
      out: ["肉か魚の定食にして、主食を極端に減らさない"]
    },
    "胃もたれ": {
      points: ["脂質を控えめにして、温かくやわらかい料理を選ぶ"],
      nutrients: ["消化しやすいたんぱく質", "ビタミンB群", "水分"],
      foods: ["豆腐", "白身魚", "卵", "大根", "うどん", "鶏ささみ"],
      menus: ["豆腐と卵のあんかけ", "白身魚と大根のやさしい煮物"],
      store: ["茶碗蒸し", "豆腐", "おでんの大根と卵", "温かいうどん"],
      out: ["揚げ物やこってり麺より、うどん・焼き魚・湯豆腐系を選ぶ"]
    }
  },
  habits: {
    "朝食少なめ": {
      points: ["朝は小さくても、たんぱく質を1品足す"],
      nutrients: ["たんぱく質", "炭水化物"],
      foods: ["卵", "ヨーグルト", "納豆", "おにぎり"],
      cautions: ["朝食を完全に抜く日が続くと、昼以降に食欲が強く出やすくなります"]
    },
    "肉魚卵が少ない": {
      points: ["毎食で手のひら半分から1枚分の主菜を意識する"],
      nutrients: ["たんぱく質", "鉄", "ビタミンB群"],
      foods: ["卵", "魚", "鶏肉", "豆腐", "納豆"],
      cautions: ["野菜中心でも、主菜が少ないと満足感や回復感が出にくいことがあります"]
    },
    "野菜が少ない": {
      points: ["包丁を使わない野菜や汁物から足す"],
      nutrients: ["食物繊維", "ビタミンC", "カリウム"],
      foods: ["冷凍ブロッコリー", "カット野菜", "ミニトマト", "きのこ"],
      cautions: ["野菜だけを増やして主食や主菜を削りすぎないようにしましょう"]
    },
    "甘いものが多い": {
      points: ["甘いものを減らす前に、食事のたんぱく質と主食を整える"],
      nutrients: ["たんぱく質", "ビタミンB群", "食物繊維"],
      foods: ["卵", "豚肉", "オートミール", "ヨーグルト"],
      cautions: ["甘いものをゼロにするより、食事の満足感を上げる方が続きやすいです"]
    },
    "揚げ物が多い": {
      points: ["揚げ物の日は、次の食事を焼く・蒸す・煮るに寄せる"],
      nutrients: ["食物繊維", "ビタミンC", "良質な脂質"],
      foods: ["魚", "豆腐", "海藻", "ブロッコリー"],
      cautions: ["脂質をゼロにせず、揚げ物頻度を整える方向で考えましょう"]
    },
    "主食を抜きがち": {
      points: ["トレーニング日や活動量が多い日は、少量の主食を戻す"],
      nutrients: ["炭水化物", "ビタミンB群"],
      foods: ["ごはん", "もち麦", "さつまいも", "オートミール"],
      cautions: ["主食を抜きすぎると、空腹感や間食が増えることがあります"]
    },
    "水分が少ない": {
      points: ["食事と一緒に、まずコップ1杯の水分を足す"],
      nutrients: ["水分", "ミネラル"],
      foods: ["水", "麦茶", "味噌汁", "スープ"],
      cautions: ["カフェイン飲料だけで水分を済ませすぎないようにしましょう"]
    }
  },
  goals: {
    "減量中": {
      points: ["減らすより先に、主菜・野菜・主食の形を整える"],
      cautions: ["体重を急いで落とそうとして、主食や脂質を削りすぎないようにしましょう"]
    },
    "筋トレ中": {
      points: ["トレーニング前後は、たんぱく質と主食をセットにする"],
      cautions: ["たんぱく質だけに偏らず、動くための主食も適量入れましょう"]
    },
    "体調を整えたい": {
      points: ["温かい汁物、主菜、野菜を1食の中にそろえる"],
      cautions: ["食材を増やす時は、一度に変えすぎず1つずつ試しましょう"]
    },
    "忙しくても整えたい": {
      points: ["コンビニや外食でも、主食・主菜・汁物の3点で考える"],
      cautions: ["完璧な自炊を目指しすぎず、買えるもので整える日を作りましょう"]
    }
  }
};

const styleMenus = {
  "自炊": {
    menus: ["鶏むねときのこの具だくさんスープ", "鮭と温野菜のごはんプレート", "卵と豆腐のあんかけ丼"],
    store: ["足りない時の補助として、ヨーグルト・ゆで卵・カット野菜"],
    out: ["外食時は定食型を選び、主菜と汁物をそろえる"]
  },
  "コンビニ": {
    menus: ["家では味噌汁やスープだけ足して、買った主菜と合わせる"],
    store: ["おにぎり、サラダチキン、ゆで卵、海藻サラダ、味噌汁", "焼き魚、豆腐バー、ギリシャヨーグルト、バナナ"],
    out: ["外食になった日は、揚げ物単品より定食やスープ付きにする"]
  },
  "外食多め": {
    menus: ["家では卵・豆腐・野菜スープなど軽い整えメニューにする"],
    store: ["外食の不足分として、果物・ヨーグルト・海藻サラダを足す"],
    out: ["丼や麺だけの日は、卵・豆腐・小鉢・汁物のどれかを追加する", "大盛りより、主菜がある定食を選ぶ"]
  },
  "家族と同じ食事": {
    menus: ["家族の主菜はそのままに、自分は野菜小鉢や汁物を足す", "揚げ物の日は大根おろしや具だくさん味噌汁を合わせる"],
    store: ["足りない分だけ、豆腐・納豆・カット野菜・果物を追加する"],
    out: ["家族の予定に合わせつつ、主食量と汁物で調整する"]
  }
};

function selected(name) {
  return [...document.querySelectorAll(`[name="${name}"]:checked`)].map((input) => input.value);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function limit(items, count) {
  return unique(items).slice(0, count);
}

function collectAdvice(goal, concerns, style, habits) {
  const pointItems = [adviceBase.goals[goal]?.points].flat();
  const nutrients = [];
  const foods = [];
  const homeMenus = [];
  const storeItems = [];
  const eatingOut = [];
  const cautions = [adviceBase.goals[goal]?.cautions];

  const concernTargets = concerns.length ? concerns : ["疲れ"];
  concernTargets.forEach((item) => {
    const data = adviceBase.concerns[item];
    if (!data) return;
    pointItems.push(...data.points);
    nutrients.push(...data.nutrients);
    foods.push(...data.foods);
    homeMenus.push(...data.menus);
    storeItems.push(...data.store);
    eatingOut.push(...data.out);
  });

  habits.forEach((item) => {
    const data = adviceBase.habits[item];
    if (!data) return;
    pointItems.push(...data.points);
    nutrients.push(...data.nutrients);
    foods.push(...data.foods);
    cautions.push(...data.cautions);
  });

  const styleData = styleMenus[style];
  homeMenus.push(...styleData.menus);
  storeItems.push(...styleData.store);
  eatingOut.push(...styleData.out);

  if (!habits.length) {
    pointItems.push("気になる項目を1つ選ぶと、より具体的な見直し案になります");
  }

  cautions.push("強く制限するより、続けやすい食事の形を整えることを優先しましょう");

  return {
    points: limit(pointItems, 4),
    nutrients: limit(nutrients, 6),
    foods: limit(foods, 8),
    homeMenus: limit(homeMenus, 4),
    storeItems: limit(storeItems, 5),
    eatingOut: limit(eatingOut, 4),
    cautions: limit(cautions, 4)
  };
}

function renderList(id, items) {
  $(id).innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function buildLineText(goal, concerns, style, habits, advice) {
  const concernText = concerns.length ? concerns.join("、") : "未選択";
  const habitText = habits.length ? habits.join("、") : "未選択";
  return [
    "【からだ整えごはん相談】",
    `目的：${goal}`,
    `気になること：${concernText}`,
    `食事スタイル：${style}`,
    `食事傾向：${habitText}`,
    "",
    "今日の見直しポイント：",
    ...advice.points.map((item) => `・${item}`),
    "",
    `不足しやすい可能性がある栄養素の候補：${advice.nutrients.join("、")}`,
    `おすすめ食材：${advice.foods.join("、")}`,
    "",
    "この内容をもとに、今日食べやすいメニューや調整を相談したいです。"
  ].join("\n");
}

function renderResults(event) {
  event.preventDefault();
  const goal = selected("goal")[0];
  const concerns = selected("concern");
  const style = selected("style")[0];
  const habits = selected("habit");
  const advice = collectAdvice(goal, concerns, style, habits);

  $("resultSummary").textContent = `${goal}・${style}の方に向けて、${concerns.length ? concerns.join("、") : "最近の調子"}をふまえた食事案です。`;
  renderList("pointList", advice.points);
  renderList("nutrientList", advice.nutrients.map((item) => `${item}を意識`));
  renderList("foodList", advice.foods);
  renderList("homeMenuList", advice.homeMenus);
  renderList("storeList", advice.storeItems);
  renderList("eatingOutList", advice.eatingOut);
  renderList("cautionList", advice.cautions);
  $("lineCopy").value = buildLineText(goal, concerns, style, habits, advice);
  $("results").hidden = false;
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
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
