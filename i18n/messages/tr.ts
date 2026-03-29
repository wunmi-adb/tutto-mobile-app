import type { TranslationMessages } from "./en";

const tr = {
  "common.language": "Dil",
  "welcome.slides.organized.title": "Mutfağın,\ndüzenli.",
  "welcome.slides.organized.subtitle":
    "Elindekileri tek bakışta gör. Unutulan malzemelere ve aynı şeyi iki kez almaya son.",
  "welcome.slides.cook.title": "Elindekilerle\nyemek yap.",
  "welcome.slides.cook.subtitle":
    "Malzemelerine göre hazırlanan tarifleri keşfet. Daha az israf, daha çok yaratıcılık.",
  "welcome.slides.plan.title": "Öğünlerini planla,\nzorlanmadan.",
  "welcome.slides.plan.subtitle":
    "Haftalık planını oluştur ve yalnızca ihtiyacın olanları satın al.",
  "welcome.auth.apple": "Apple ile devam et",
  "welcome.auth.google": "Google ile devam et",
  "welcome.terms.prefix": "Devam ederek şu belgeleri kabul edersin: ",
  "welcome.terms.termsOfService": "Kullanım Koşulları",
  "welcome.terms.conjunction": " ve ",
  "welcome.terms.privacyPolicy": "Gizlilik Politikası",
  "welcome.terms.suffix": ".",
  "household.create.title": "Hanene bir isim ver.",
  "household.create.subtitle":
    "Kilerine bir isim ver ve kaç kişiyi doyurduğunu bize söyle",
  "household.create.nameLabel": "HANE ADI",
  "household.create.namePlaceholder": "ör. Yılmaz Ailesi",
  "household.create.peopleLabel": "HANEDEKİ KİŞİ SAYISI",
  "household.create.cta": "Hane oluştur",
  "household.choose.title": "Hanen.",
  "household.choose.subtitle": "Yeni bir kiler oluştur ya da var olan bir kilere katıl",
  "household.choose.createTitle": "Hane oluştur",
  "household.choose.createDescription":
    "Yeni bir kiler başlat ve partnerini daha sonra katılması için davet et",
  "household.choose.joinTitle": "Haneye katıl",
  "household.choose.joinDescription":
    "Partnerinin kilerine katılmak için onun paylaştığı davet kodunu gir",
  "household.join.title": "Bir haneye katıl.",
  "household.join.subtitle": "Partnerinin seninle paylaştığı davet kodunu gir",
  "household.join.codeLabel": "DAVET KODU",
  "household.join.codePlaceholder": "ör. TUTTO-A1B2C3",
  "household.join.cta": "Haneye katıl",
  "notifications.title": "Gelistirmelerden haberdar ol.",
  "notifications.subtitle":
    "Urunlerin son kullanma tarihi yaklastiginda, ogunler planlandiginda veya partnerin kilere bir sey eklediginde bildirim al.",
  "notifications.cta.default": "Bildirimleri etkinlestir",
  "notifications.cta.requesting": "Isteniyor...",
  "notifications.cta.enabled": "Bildirimler etkin",
  "notifications.status.off":
    "Tutto icin bildirimler kapali. Daha sonra cihaz ayarlarindan etkinlestirebilirsin.",
  "notifications.status.error":
    "Bildirim izni istemi su anda acilamadi. Tekrar deneyebilir veya devam edebilirsin.",
  "notifications.openSettings": "Ayarlari ac",
  "notifications.later": "Belki daha sonra",
  "appliances.title": "Mutfaginda neler var?",
  "appliances.subtitle":
    "Cihazlarini secmek icin dokun veya ozel olanlari yazip ekle",
  "appliances.addCustom": "OZEL EKLE",
  "appliances.customPlaceholder": "Yaz ve enter'a bas",
  "appliances.cta": "Devam et",
  "appliances.options.oven": "Firın",
  "appliances.options.microwave": "Mikrodalga",
  "appliances.options.airFryer": "Air fryer",
  "appliances.options.blender": "Blender",
  "appliances.options.toaster": "Ekmek kizartma makinesi",
  "appliances.options.slowCooker": "Yavas pisirici",
  "appliances.options.instantPot": "Instant Pot",
  "appliances.options.foodProcessor": "Mutfak robotu",
  "appliances.options.standMixer": "Stand mikser",
  "appliances.options.riceCooker": "Pilav pisirici",
  "appliances.options.grill": "Izgara",
  "appliances.options.stovetop": "Ocak",
  "appliances.options.dishwasher": "Bulasicak makinesi",
  "appliances.options.waffleMaker": "Waffle makinesi",
} as const satisfies TranslationMessages;

export default tr;
