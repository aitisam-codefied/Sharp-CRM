if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let n = {};
    const r = (e) => a(e, i),
      d = { module: { uri: i }, exports: n, require: r };
    s[i] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (t(...e), n));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "491b901ac37b2602f690259d46b3b033",
        },
        {
          url: "/_next/static/Ra0ftqeG8DdNKJ16Uc-3O/_buildManifest.js",
          revision: "a1a85ecd0a97cc85506a64ddccbedd51",
        },
        {
          url: "/_next/static/Ra0ftqeG8DdNKJ16Uc-3O/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1143-eea1393f1b4e63f9.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/118-5475660f1414a0d9.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1298-66729edb3769a786.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1372-bb3439ff845ca45d.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1422-d69c57eba36db146.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1586-ce67c5b5b0468278.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1637-ec0794342dc647d5.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/164f4fb6-08cf422c53ba9d7f.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1684-f6623fcef8135214.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/1997-4fcf5b2642e10635.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/2373-c5363f96bd450fc5.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/2555-873c2bd0fceaa640.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/2913-d228d3571640a880.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/2960-ac3030f8f0c72f04.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/2f0b94e8-c7cbb08fcaccaeb5.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/3464-b427d8fb9ca8238b.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/4073-4e5252e5083d581a.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/4086-d5915e31e70b5f32.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/4582-b778dc8ed470fdb3.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/472.2c08b965bd9148e2.js",
          revision: "2c08b965bd9148e2",
        },
        {
          url: "/_next/static/chunks/4724-9e4e90b13cb329a7.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/4971-29575993ea09322f.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/4bd1b696-91258da1fbf4dfca.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/5176-7ac3cd3da81466f1.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/5390-f9baf3d3b0d1b614.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/5532.d7158eec3667fc9e.js",
          revision: "d7158eec3667fc9e",
        },
        {
          url: "/_next/static/chunks/559-08e1c8082c6ce97a.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/5869-6a16552835821fc3.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/6426-669132b48fcc9a24.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/665-1b2be579a8317f08.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/6874-496c5c51fefb2133.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/6967-c77af6b87f74e393.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/712-ec3c02cdd19de8ce.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/7213-450b80f4ee3b6022.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/7568-23d0125b2336bb68.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/7598-02fd9a623704fd92.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/7649-68f58b20f5c9b6db.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/822.1e6b5f64470b5c02.js",
          revision: "1e6b5f64470b5c02",
        },
        {
          url: "/_next/static/chunks/8255.65bd77452a29b610.js",
          revision: "65bd77452a29b610",
        },
        {
          url: "/_next/static/chunks/8862-b2c92f761aba2325.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/9173-7102f477cec26d2c.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/9304-766551aad35e3670.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/9341.c00e1bbc955787be.js",
          revision: "c00e1bbc955787be",
        },
        {
          url: "/_next/static/chunks/9854-1cc5a7135261de6c.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/9909-ffaf94d30a710a14.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/ad2866b8-a4659a388c5e0680.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-51b16a580e7c9c15.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/clock-system/loading-a2e5d552304eb47f.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/clock-system/page-9149a04ba98d61c1.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/company/page-2e9e21965ff12a79.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-26dc3a1a9888525c.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-7fe14279f2054c71.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/documents/loading-d45ef1a4727827b0.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/documents/page-391a94634c36529c.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/error-ad0ad3e6f0d1879f.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/feedback/loading-6d4fff6920711b0b.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/feedback/page-f869d982107e2814.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/food-images/loading-85dbe1d02895f52a.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/food-images/page-8606de329ea5576d.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/forget-password/page-5aa5c8cfccab5ac6.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/in-transit/loading-b3a863f4c27c9ab5.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/in-transit/page-fef0a4fd33f000b0.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/incidents/loading-aa0950eb049b6de3.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/incidents/page-cd3bd8283e29968a.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/layout-9a18a52fe2d28086.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/login/page-907ae043edbcedce.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/meals/loading-16a2b2b1763fee86.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/meals/page-f59a26faba709737.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/medical-staff/loading-1b37bb26b651cda4.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/medical-staff/page-ddb78c850ce7531e.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/new-user/loading-08e49cc64c51729d.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/new-user/page-c30a14fd7bac3fec.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/not-found-6b92af06a3fead1d.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/notifications/loading-f26ce7e908e91f42.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/notifications/page-6b662d15cfc1b4bb.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/observations/loading-2a7155fda36ca87d.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/observations/page-6b1e728655f145a9.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/occupancy/loading-68ba605113b40f66.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/occupancy/page-ad09b22e227dea34.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/on-boarding/page-22523f79c349a623.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/other-removals/loading-d260c4d0bb6dd8f4.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/other-removals/page-b3b867290da20952.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/otp/page-f9a6149efafba811.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/page-2e61612692c94897.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/profile/page-b181549ee5b91934.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/qr-scanner/page-0bb04b6b5aac9c09.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/reports/loading-293b3bdf4b556296.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/reports/page-63e35641b2f9f417.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/reset-password/page-73e8de410a49c51e.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/rooms/loading-1d100f3b0e45c08f.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/rooms/page-5fd07d809489e3a0.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/safeguarding/loading-e92803644c959369.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/safeguarding/page-0fa023ba269fc5ea.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/scheduler/page-040ee49ecb883a97.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/service-users/loading-7521c16d20cc4185.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/service-users/page-ac58f33084bb8733.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/staffs/loading-0d9ab365ee1e8b5e.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/staffs/page-a27e6165bb27b484.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/su-basket/loading-febf33d77745c457.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/su-basket/page-5c2aaef7562e0fc9.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/welfare/loading-75dd3ea4bb5adb44.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/app/welfare/page-d9e37f61e7742640.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/b645e135-286f13ab579a63a2.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/bc98253f.b4e66dfc08abe763.js",
          revision: "b4e66dfc08abe763",
        },
        {
          url: "/_next/static/chunks/framework-82b67a6346ddd02b.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/main-4e39213745da19a5.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/main-app-b6bedd0b3edc7e33.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/pages/_app-0b0b6e26a728d49c.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/pages/_error-f94192b14105bd76.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-da25b1a6aea75c16.js",
          revision: "Ra0ftqeG8DdNKJ16Uc-3O",
        },
        {
          url: "/_next/static/css/7e7d96b1e6991756.css",
          revision: "7e7d96b1e6991756",
        },
        {
          url: "/_next/static/css/a79b9a7ff82f7117.css",
          revision: "a79b9a7ff82f7117",
        },
        {
          url: "/_next/static/css/cb8544a4ef612ecd.css",
          revision: "cb8544a4ef612ecd",
        },
        {
          url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
          revision: "9dda5cfc9a46f256d0e131bb535e46f8",
        },
        {
          url: "/_next/static/media/21350d82a1f187e9-s.woff2",
          revision: "4e2553027f1d60eff32898367dd4d541",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
          revision: "9e494903d6b0ffec1a1e14d34427d44d",
        },
        {
          url: "/_next/static/media/broken.6ccbe972.jpg",
          revision: "03c04b5ba96f46634bbc28b5d7dac1e5",
        },
        {
          url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
          revision: "027a89e9ab733a145db70f09b8a18b42",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        {
          url: "/apple-touch-icon.png",
          revision: "7e486297792eb23151a64f2a98dfdae9",
        },
        { url: "/broken.jpg", revision: "03c04b5ba96f46634bbc28b5d7dac1e5" },
        {
          url: "/favicon-96x96.png",
          revision: "cc89036d4d9d2807bfc51eedc65e65ec",
        },
        { url: "/favicon.ico", revision: "5d126a555115c14aadd4c0d0243e0fdf" },
        { url: "/favicon.svg", revision: "d16a32c6077604e80f071583a3b6f89e" },
        { url: "/food1.jpg", revision: "a417192dcb4fcd46978a2eb5c329991b" },
        { url: "/food2.jpg", revision: "2cd9494e895cb950f477dce81530f08a" },
        { url: "/food3.jpg", revision: "da5893e56131e2e60e5d6df2d3f79513" },
        { url: "/food4.jpg", revision: "f8daebcec97c99cf461a33876fe14161" },
        { url: "/food5.jpg", revision: "14f57a2c6d33eccc18d1133eb9542d67" },
        { url: "/login_bg.svg", revision: "b18906573b9cc8f3ac6d17496a876262" },
        { url: "/logo.png", revision: "ed130f82d578bf4d1052db17a5cdf12f" },
        { url: "/manifest.json", revision: "f4ac2acac44edeb38fb8e339f0260a36" },
        {
          url: "/placeholder-logo.png",
          revision: "95d8d1a4a9bbcccc875e2c381e74064a",
        },
        {
          url: "/placeholder-logo.svg",
          revision: "1e16dc7df824652c5906a2ab44aef78c",
        },
        {
          url: "/placeholder-user.jpg",
          revision: "7ee6562646feae6d6d77e2c72e204591",
        },
        {
          url: "/placeholder.jpg",
          revision: "1e533b7b4545d1d605144ce893afc601",
        },
        {
          url: "/placeholder.svg",
          revision: "35707bd9960ba5281c72af927b79291f",
        },
        {
          url: "/pwa-192x192.png",
          revision: "0551f8e49665a2c6914d7746c9e58b0e",
        },
        {
          url: "/pwa-512x512.png",
          revision: "b769676b55579ed0e691cc603bb2e07d",
        },
        { url: "/robots.txt", revision: "cd9cd94aaa699e0a16e692b6bb16f672" },
        {
          url: "/screenshots/screen1.png",
          revision: "44f7e87573e2e7f657486aab0f4fb71f",
        },
        {
          url: "/screenshots/screen2.png",
          revision: "8b75973741868ac6b25b36b512b417bf",
        },
        { url: "/side-img.png", revision: "0ee1c6d3d6a174c677a6ce36201ca85c" },
        { url: "/sideimg.png", revision: "16fefe0070f826809ed0ea3236c4756f" },
        { url: "/sms.png", revision: "d884d5c506bfd595a10fbd25db2330be" },
        { url: "/stripe1.png", revision: "628e837ba60ca506b138d0d84f260a6b" },
        { url: "/stripe1.svg", revision: "d10703d7b260b755792f6fc5e1f536da" },
        { url: "/stripe2.png", revision: "69fbd119e1933a6a02dbf0e7f0bf6b54" },
        { url: "/stripe3.png", revision: "0e40807f63a72c5d0372903c3c8a5672" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: c,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
