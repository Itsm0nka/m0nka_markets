import React from "react";

const Footer = () => {
  return (
    <div className="dark:bg-gray-900 dark:text-gray-300">
      <hr className="border-neutral-200 dark:border-gray-700" />

      <div className="container max-w-[1440px] mx-auto flex flex-wrap gap-10 pt-10">
        <div className="flex-1 min-w-[300px]">
          <h1 className="font-semibold leading-7.5 text-[30px] dark:text-white">
            Yandex GO ilovasidagi <br />
            Market xizmatida xaridlar qiling
          </h1>

          <div className="flex items-center gap-2.5 mt-7.5">
            <img
              src="https://avatars.mds.yandex.net/get-marketcms/879900/img-58d7454d-7181-467c-8d49-9d05b42eb004.svg/orig"
              alt=""
              className="cursor-pointer"
            />
            <img
              src="https://avatars.mds.yandex.net/get-marketcms/944743/img-bbbfd2a5-2cde-49f2-a0a2-da823cfe6bc1.svg/orig"
              alt=""
              className="cursor-pointer"
            />
            <img
              src="https://avatars.mds.yandex.net/get-marketcms/1523779/img-c449a52c-9471-4d52-a39a-8982314fe6ee.svg/orig"
              alt=""
              className="cursor-pointer"
            />
            <img
              src="https://avatars.mds.yandex.net/get-marketcms/1534436/img-9c891cb6-576b-4706-ae63-497a72111d5d.svg/orig"
              alt=""
              className="cursor-pointer"
            />
          </div>

          <div className="mt-20">
            <img
              src="https://barcode.yandex.net/qrcode/https%3A%2F%2Fyandex.go.link%2Fexternal%3Fservice%3Dmarket%26adj_t%3D1l8r5x4d_1lc7ilsd%26adj_engagement_type%3Dfallback_click.svg"
              className="w-32"
              alt=""
            />
            <p className="text-neutral-500 dark:text-gray-400 text-[17px] leading-5 mt-3">
              Kamerani QR kodiga yo'naltiring, <br />
              ilovani yuklab olish uchun
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap gap-10">
          <div>
            <h3 className="font-semibold text-lg dark:text-white">Xaridorlarga</h3>
            <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-3">
              Mahsulotni qanday tanlash kerak
            </p>
            <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-2">
              To'lov va etkazib berish
            </p>
            <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-2">
              Fikr-mulohaza
            </p>
            <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-2">
              Xizmat haqida
            </p>
            <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-2">
              Qaytish
            </p>

            <div className="mt-10">
              <h3 className="font-semibold text-lg dark:text-white">Sotuvchilar</h3>
              <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-3">
                Hamkorlar uchun sayt
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg dark:text-white">Hamkorlik</h3>
            <p className="text-neutral-500 dark:text-gray-400 text-[14px] hover:text-red-600 cursor-pointer mt-3">
              Buyurtma topshirish punktini oching
            </p>
          </div>
        </div>
      </div>

      <div className="py-5 mt-10 bg-neutral-200 dark:bg-gray-800 text-neutral-500 dark:text-gray-400">
        <div className="container max-w-[1440px] mx-auto flex justify-between flex-wrap gap-2">
          <p className="text-[14px] hover:text-red-600 cursor-pointer">
            Foydalanuvchi shartnomasi
          </p>
          <p className="text-[14px]">
            © 2025{" "}
            <span className="hover:text-red-600 cursor-pointer">«YandexGo UB» MChJ</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
