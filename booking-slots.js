window.AI_LIFE_BOOKING_CONFIG = {
  apiEndpoint: "https://script.google.com/macros/s/AKfycbzmO7AwbQ1wF1GYp__NkVQNFGWmvFd5O4wJks2QpOY7AV8-pjK-AXexsucnLDq6MZk/exec",
  adminPage: "admin.html",
  cacheKey: "aiLifeBookingSlotsV2",
  cacheMaxAge: 6 * 60 * 60 * 1000,
};

// Initial schedule shown immediately while the live Google data refreshes.
// Updated 2026-09-16 from the reservation spreadsheet.
window.AI_LIFE_BOOKING_WEEKS = [
  {
    label: "2026年9月16日（水）〜9月20日（日）",
    slots: [
      { id: "slot_20260916093046_1401", date: "2026年9月16日（水）", time: "13:00〜14:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093049_4957", date: "2026年9月16日（水）", time: "16:00〜17:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093051_5712", date: "2026年9月16日（水）", time: "18:00〜19:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093053_5850", date: "2026年9月16日（水）", time: "20:00〜21:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093055_832", date: "2026年9月16日（水）", time: "21:00〜22:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093057_842", date: "2026年9月16日（水）", time: "22:00〜23:00", capacity: 1, remaining: 1, isPublic: true },

      { id: "slot_20260915144057_8663", date: "2026年9月17日（木）", time: "12:00〜13:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144138_8115", date: "2026年9月17日（木）", time: "14:00〜15:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093101_6467", date: "2026年9月17日（木）", time: "15:00〜16:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144223_6828", date: "2026年9月17日（木）", time: "16:00〜17:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093102_1036", date: "2026年9月17日（木）", time: "17:00〜18:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144252_4125", date: "2026年9月17日（木）", time: "18:00〜19:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093104_6382", date: "2026年9月17日（木）", time: "19:00〜20:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144328_7496", date: "2026年9月17日（木）", time: "20:00〜21:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093106_9493", date: "2026年9月17日（木）", time: "21:00〜22:00", capacity: 1, remaining: 1, isPublic: true },

      { id: "slot_20260915144345_8853", date: "2026年9月18日（金）", time: "11:00〜12:00", capacity: 1, remaining: 0, isPublic: true },
      { id: "slot_20260915144413_4216", date: "2026年9月18日（金）", time: "13:00〜14:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093114_272", date: "2026年9月18日（金）", time: "14:00〜15:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144428_312", date: "2026年9月18日（金）", time: "15:00〜16:00", capacity: 1, remaining: 0, isPublic: true },
      { id: "slot_20260915144440_8938", date: "2026年9月18日（金）", time: "17:00〜18:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144455_3110", date: "2026年9月18日（金）", time: "19:00〜20:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093116_737", date: "2026年9月18日（金）", time: "20:00〜21:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144509_1265", date: "2026年9月18日（金）", time: "21:00〜22:00", capacity: 1, remaining: 1, isPublic: true },

      { id: "slot_20260915144523_2207", date: "2026年9月19日（土）", time: "12:00〜13:00", capacity: 1, remaining: 0, isPublic: true },
      { id: "slot_20260915144608_3905", date: "2026年9月19日（土）", time: "14:00〜15:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093118_9537", date: "2026年9月19日（土）", time: "15:00〜16:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144617_7192", date: "2026年9月19日（土）", time: "16:00〜17:00", capacity: 1, remaining: 0, isPublic: true },
      { id: "slot_20260916093120_1241", date: "2026年9月19日（土）", time: "17:00〜18:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144734_2917", date: "2026年9月19日（土）", time: "18:00〜19:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093122_9253", date: "2026年9月19日（土）", time: "19:00〜20:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144637_8474", date: "2026年9月19日（土）", time: "20:00〜21:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093124_1365", date: "2026年9月19日（土）", time: "21:00〜22:00", capacity: 1, remaining: 1, isPublic: true },

      { id: "slot_20260915144929_3476", date: "2026年9月20日（日）", time: "11:00〜12:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915144956_1657", date: "2026年9月20日（日）", time: "13:00〜14:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093126_172", date: "2026年9月20日（日）", time: "14:00〜15:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915145012_7957", date: "2026年9月20日（日）", time: "15:00〜16:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915145025_6978", date: "2026年9月20日（日）", time: "17:00〜18:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915145045_9710", date: "2026年9月20日（日）", time: "19:00〜20:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260916093128_1305", date: "2026年9月20日（日）", time: "20:00〜21:00", capacity: 1, remaining: 1, isPublic: true },
      { id: "slot_20260915145111_2487", date: "2026年9月20日（日）", time: "21:00〜22:00", capacity: 1, remaining: 1, isPublic: true },
    ],
  },
];
