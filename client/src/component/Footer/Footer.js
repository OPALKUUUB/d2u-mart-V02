import React from 'react'

function Footer() {
  return (
    <>
        <div className="w-full flex justify-end bg-[#fef1e7]" style={{fontFamily: '"Prompt", sans-serif'}}>
            <div className="w-full flex flex-col items-center px-10 py-[30px] gap-8">
                <div className="w-full max-w-[700px] flex flex-col items-center md:items-start justify-start gap-1">
                    <p className="font-[600] text-[24px]">ติดต่อเรา</p>
                    <div className="w-full flex flex-col md:flex-row items-center">
                        <div className="flex flex-col md:flex-row items-start gap-[30px] text-[20px]">
                            <div className="flex items-center gap-3  ">
                                <img className="w-6" src="/image/line.png" alt="" />
                                <p className="mb-0">@Delivery2you</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img className="w-6" src="/image/facebook.png" alt="" />
                                <p className="mb-0">Delivery2you</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img className="w-6" src="/image/tel.png" alt="" />
                                <p className="mb-0">02-023-7405</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[700px] flex flex-col items-center md:items-start justify-start gap-1">
                    <p className="font-[600] text-[24px]">เวลาทำการ</p>
                    <div className="w-full flex justify-center md:justify-start items-center gap-[30px] text-[20px]">
                        <p className="mb-0">เวลาทำการ ทุกวัน 08:00-22:30 น.</p>
                    </div>
                </div>
            </div>
            <img className="hidden md:flex w-[120px] lg:w-[180px] h-full max-h-[270px] object-cover" src="/image/side.png" alt=""/>
        </div>
        <div className="w-full h-[70px] flex justify-center items-center bg-[#040629] text-white text-[20px]">
            Copyright © 2022 . All rights reserved.
        </div>
    </>
  )
}

export default Footer