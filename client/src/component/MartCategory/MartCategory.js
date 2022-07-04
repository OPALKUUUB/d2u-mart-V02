import React, { useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MartCategory.css"
import { Navigation , Pagination } from "swiper";

function MartCategory({allCategory , categorySelected , setCategorySelected}) {

    return (
        <div className="w-full flex justify-center bg-[#fef1e7] relative" style={{fontFamily: '"Prompt", sans-serif'}}>
            
            <img src="/image/flag.png" alt="" className="absolute left-20 bottom-0 w-[400px]" />
            
            <div className="w-full max-w-[1200px] flex flex-col items-start p-2 gap-5">
                <div className="w-full flex flex-col items-end gap-4 relative pr-[135px]">
                    <p className="mb-0 text-[50px] tracking-[3px] leading-3">CATEGORIES</p>
                    <p className="mb-0 text-[42px] tracking-[3px] font-[300]">หมวดหมู่</p>
                    <img src="/image/vertical-dots.png" alt="" className="absolute top-[120px] right-[140px] w-[52px]" />
                    <img src="/image/catagory.png" alt="" className="absolute -top-[20px] right-0 w-[110px]" />
                    <img src="/image/ciecle.png" alt="" className="absolute -bottom-[330px] right-0 w-[48px]" />
                </div>
                <div className="w-[77%] flex justify-start relative ml-2">
                    {allCategory.length >= 4 ? 
                    <Swiper
                        key={'swipermain'}
                        navigation={true}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Navigation , Pagination]}
                        slidesPerView={2}
                        slidesPerGroup={2}
                        spaceBetween={10}
                        breakpoints={{
                            768:{
                                slidesPerView:3,
                                slidesPerGroup:3,
                                spaceBetween:10,
                            },
                            1024:{
                                slidesPerView:4,
                                slidesPerGroup:4,
                                spaceBetween:30,
                            }
                        }}
                        className="w-full flex justify-center justify-items-center h-[300px] px-2 mart-category"
                    >
                        {allCategory?.map((category , index)=>(
                            <SwiperSlide key={`category${index}`}>
                                <div className={`cursor-pointer w-full max-w-[250px] h-full max-h-[200px] bg-[#c8ceca] ${categorySelected === index ? 'bg-[#f48566] scale-105' : 'bg-[#c8ceca]'} rounded-xl flex p-2 items-center justify-center scale-100 hover:scale-105 ease-linear duration-200 mt-2 shadow-md`}
                                    onClick={()=>{setCategorySelected(index)}}
                                >
                                    <p className="m-0 text-[16px] text-center">{category?.name}</p>
                                </div>
                                
                            </SwiperSlide>
                        ))}
                        {allCategory.length > 4 && <p className="absolute bottom-[23px] right-[48px] text-[#7b7e7c]">เลื่อน</p>}
                    </Swiper>
                    :
                    <Swiper 
                        key={'swipersub'}
                        navigation={true}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Navigation , Pagination]}
                        slidesPerView={2}
                        slidesPerGroup={2}
                        spaceBetween={10}
                        breakpoints={{
                            768:{
                                slidesPerView:3,
                                slidesPerGroup:3,
                                spaceBetween:10,
                            },
                            1024:{
                                slidesPerView:3,
                                slidesPerGroup:3,
                                spaceBetween:30,
                            }
                        }}
                        className="w-full flex justify-center justify-items-center h-[300px] px-2 mart-category"
                    >
                        {allCategory?.map((category , index)=>(
                            <SwiperSlide key={`category${index}`}>
                                <div className={`cursor-pointer w-full max-w-[250px] h-full max-h-[200px] bg-[#c8ceca] ${categorySelected === index ? 'bg-[#f48566] scale-105' : 'bg-[#c8ceca]'} rounded-xl flex p-2 items-center justify-center scale-100 hover:scale-105 ease-linear duration-200 mt-2 shadow-md`}
                                    onClick={()=>{setCategorySelected(index)}}
                                >
                                    <p className="m-0 text-[16px] text-center">{category?.name}</p>
                                </div>
                                
                            </SwiperSlide>
                        ))}
                        <p className="flex md:hidden absolute bottom-[23px] right-[48px] text-[#7b7e7c]">เลื่อน</p>
                    </Swiper>
                    
                    }
                    
                </div>
            </div>
            
        </div>
    )
}

export default MartCategory