import type { TranslationMessages } from "./en";

const ja = {
  "common.language": "言語",
  "welcome.slides.organized.title": "キッチンを、\nすっきり管理。",
  "welcome.slides.organized.subtitle":
    "食材をひと目で確認。使い忘れや買いすぎを防げます。",
  "welcome.slides.cook.title": "あるもので、\nすぐ料理。",
  "welcome.slides.cook.subtitle":
    "手元の食材をもとにしたレシピをチェック。無駄を減らして、もっと自由に。",
  "welcome.slides.plan.title": "献立づくりも、\nかんたんに。",
  "welcome.slides.plan.subtitle":
    "1週間の予定を立てて、本当に必要なものだけを買いましょう。",
  "welcome.auth.apple": "Appleで続ける",
  "welcome.auth.google": "Googleで続ける",
  "welcome.terms.prefix": "続行すると、",
  "welcome.terms.termsOfService": "利用規約",
  "welcome.terms.conjunction": "および",
  "welcome.terms.privacyPolicy": "プライバシーポリシー",
  "welcome.terms.suffix": "に同意したものとみなされます。",
  "household.create.title": "世帯に名前をつけましょう。",
  "household.create.subtitle": "パントリーに名前をつけて、何人分の食事を用意するか教えてください",
  "household.create.nameLabel": "世帯名",
  "household.create.namePlaceholder": "例: 田中ファミリー",
  "household.create.peopleLabel": "世帯の人数",
  "household.create.cta": "世帯を作成",
  "household.choose.title": "あなたの世帯。",
  "household.choose.subtitle": "新しいパントリーを作るか、既存のパントリーに参加しましょう",
  "household.choose.createTitle": "世帯を作成",
  "household.choose.createDescription":
    "新しいパントリーを始めて、あとでパートナーを招待できます",
  "household.choose.joinTitle": "世帯に参加",
  "household.choose.joinDescription":
    "パートナーから共有された招待コードを入力して、そのパントリーに参加します",
  "household.join.title": "世帯に参加しましょう。",
  "household.join.subtitle": "パートナーから共有された招待コードを入力してください",
  "household.join.codeLabel": "招待コード",
  "household.join.codePlaceholder": "例: TUTTO-A1B2C3",
  "household.join.cta": "世帯に参加",
  "notifications.title": "最新情報を受け取りましょう。",
  "notifications.subtitle":
    "食材の期限切れ、献立の予定、パートナーによるパントリー更新を通知で受け取れます。",
  "notifications.cta.default": "通知を有効にする",
  "notifications.cta.requesting": "リクエスト中...",
  "notifications.cta.enabled": "通知が有効です",
  "notifications.status.off":
    "Tuttoの通知はオフになっています。あとで端末の設定から有効にできます。",
  "notifications.status.error":
    "今は通知の許可ダイアログを開けませんでした。もう一度試すか、このまま続けられます。",
  "notifications.openSettings": "設定を開く",
  "notifications.later": "あとで",
  "appliances.title": "キッチンには何がありますか？",
  "appliances.subtitle":
    "タップして家電を選ぶか、入力して追加してください",
  "appliances.addCustom": "カスタムを追加",
  "appliances.customPlaceholder": "入力して改行",
  "appliances.cta": "続ける",
  "appliances.options.oven": "オーブン",
  "appliances.options.microwave": "電子レンジ",
  "appliances.options.airFryer": "エアフライヤー",
  "appliances.options.blender": "ブレンダー",
  "appliances.options.toaster": "トースター",
  "appliances.options.slowCooker": "スロークッカー",
  "appliances.options.instantPot": "インスタントポット",
  "appliances.options.foodProcessor": "フードプロセッサー",
  "appliances.options.standMixer": "スタンドミキサー",
  "appliances.options.riceCooker": "炊飯器",
  "appliances.options.grill": "グリル",
  "appliances.options.stovetop": "コンロ",
  "appliances.options.dishwasher": "食器洗い機",
  "appliances.options.waffleMaker": "ワッフルメーカー",
} as const satisfies TranslationMessages;

export default ja;
