import React, { useRef, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Yandex = () => {

  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)

  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [
    { id: 1, img: "https://avatars.mds.yandex.net/get-market-adv/8276645/dfcf6ed8-fcc7-4531-a8a2-c26d4666a393/banner-width-720" },
    { id: 2, img: " https://avatars.mds.yandex.net/get-market-adv/8081346/0be35e64-12b1-43fe-a69e-dcac55126812/banner-width-720" },
    { id: 3, img: "https://avatars.mds.yandex.net/get-market-adv/8781404/3939a9f1-0fb6-4aa3-a508-ed8e622fef3f/banner-width-720" },
    { id: 4, img: "https://avatars.mds.yandex.net/get-market-adv/8276645/8004688f-b7d5-4de1-a699-d6156c6134ed/banner-width-720" },
    { id: 5, img: "https://avatars.mds.yandex.net/get-market-adv/8276645/dfcf6ed8-fcc7-4531-a8a2-c26d4666a393/banner-width-720" },
    { id: 6, img: "https://avatars.mds.yandex.net/get-market-adv/8282799/3f952b72-9037-4f67-96fe-34397170ddaa/banner-width-720" },
    { id: 7, img: "https://avatars.mds.yandex.net/get-market-adv/8081346/0be35e64-12b1-43fe-a69e-dcac55126812/banner-width-720" },
    { id: 8, img: "https://avatars.mds.yandex.net/get-market-adv/8781404/3939a9f1-0fb6-4aa3-a508-ed8e622fef3f/banner-width-720" },
    { id: 9, img: "https://avatars.mds.yandex.net/get-market-adv/8276645/8004688f-b7d5-4de1-a699-d6156c6134ed/banner-width-720" },
    { id: 10, img:"https://avatars.mds.yandex.net/get-market-adv/8081346/03174241-8e6d-4b00-81dd-ee46bdae00ed/banner-width-720" },
    { id: 11, img:" https://avatars.mds.yandex.net/get-market-adv/8081346/3020eb27-a367-444d-adf3-35acb1f83134/banner-width-720" },
  ];

  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    centerMode: true,
    infinite: true,
    centerPadding: "20px",
    slidesToShow: 2.3, 
    speed: 700,
    arrows: false,
    dots: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <div>

      <div className="container max-w-[1410px] w-full mx-auto">
        <Slider className='' ref={sliderRef} {...settings}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`w-350 transition-all duration-500 outline-none cursor-pointer ${
                index === currentSlide ? 'scale-100 ml-1.5 opacity-100' : 'scale-95 opacity-50'
              }`}
              onClick={() => sliderRef.current.slickGoTo(index)}
            >
              <img
                src={banner.img}
                alt={`banner-${index}`}
                className="rounded-xl w-full -ml-30 h-[300px]"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Yandex;