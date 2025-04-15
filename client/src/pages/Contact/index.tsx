import { Link } from "react-router-dom"
import { GoHome } from "react-icons/go"
import { IoIosTabletPortrait } from "react-icons/io"
import { CiMail } from "react-icons/ci"

function Contact() {
  return (
    <div className="w-full">
      <div className="flex min-h-[150px] w-full flex-col items-center justify-center bg-[#f3ebd8]">
        <h1 className="mb-3 text-[35px] font-semibold text-[#292621]">Contact</h1>
        <div className="flex">
          <Link
            to="/"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Home
          </Link>{" "}
          <hr className="h-5 w-[1px] rotate-0 border-none border-l border-[#74706b] font-semibold" />
          <Link
            to="/contact"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="w-full px-20 py-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202070.14578583458!2d49.690151611573064!3d40.394475512847436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2zQmFrw7w!5e1!3m2!1str!2saz!4v1726509429462!5m2!1str!2saz"
          loading="lazy"
          className="h-[500px] w-full"
        ></iframe>
      </div>
      <div className="mb-24 flex w-full justify-between px-20">
        <div className="w-[60%]">
          <h1 className="mb-5 text-[27px] font-semibold text-[#292621]">Get in Touch</h1>
          <form action="">
            <textarea
              name=""
              id=""
              placeholder="Enter Message"
              className="mb-5 h-[150px] w-full resize-none border border-[#f2f3f5] p-[15px] text-xs transition-colors duration-300 ease-in-out focus:outline-none focus:placeholder:text-transparent placeholder:text-[#999] placeholder:text-[10px] placeholder:opacity-100"
            ></textarea>
            <div className="flex gap-5">
              <input
                type="text"
                placeholder="Enter your name"
                className="mb-5 w-full border border-[#f2f3f5] p-[15px] text-xs transition-colors duration-300 ease-in-out focus:outline-none focus:placeholder:text-transparent placeholder:text-[#999] placeholder:text-[10px] placeholder:opacity-100"
              />
              <input
                type="text"
                placeholder="Enter your email address"
                className="mb-5 w-full border border-[#f2f3f5] p-[15px] text-xs transition-colors duration-300 ease-in-out focus:outline-none focus:placeholder:text-transparent placeholder:text-[#999] placeholder:text-[10px] placeholder:opacity-100"
              />
            </div>
            <input
              type="text"
              placeholder="Enter your subject"
              className="mb-5 w-full border border-[#f2f3f5] p-[15px] text-xs transition-colors duration-300 ease-in-out focus:outline-none focus:placeholder:text-transparent placeholder:text-[#999] placeholder:text-[10px] placeholder:opacity-100"
            />
            <button className="border border-[#ff2020] bg-white px-[44px] py-[18px] text-sm font-normal text-[#ff2020] transition-all duration-300 ease-in-out hover:bg-[#ff2020] hover:text-white">
              Send
            </button>
          </form>
        </div>
        <div className="mt-12 w-[30%]">
          <div className="mb-8 flex items-center justify-start">
            <GoHome className="mr-[15px] text-[30px] text-[#909195]" />
            <div>
              <h4 className="mb-0 text-base text-[#2a2a2a]">Buttonwood, California.</h4>
              <p className="mb-[15px] font-['Jost',sans-serif] text-base font-normal leading-relaxed text-[#8a8a8a]">
                Rosemead, CA 91770
              </p>
            </div>
          </div>
          <div className="mb-8 flex items-center justify-start">
            <IoIosTabletPortrait className="mr-[15px] text-[30px] text-[#909195]" />
            <div>
              <h4 className="mb-0 text-base text-[#2a2a2a]">+1 253 565 2365</h4>
              <p className="mb-[15px] font-['Jost',sans-serif] text-base font-normal leading-relaxed text-[#8a8a8a]">
                Mon to Fri 9am to 6pm
              </p>
            </div>
          </div>
          <div className="mb-8 flex items-center justify-start">
            <CiMail className="mr-[15px] text-[30px] text-[#909195]" />
            <div>
              <h4 className="mb-0 text-base text-[#2a2a2a]">support@colorlib.com</h4>
              <p className="mb-[15px] font-['Jost',sans-serif] text-base font-normal leading-relaxed text-[#8a8a8a]">
                Send us your query anytime!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
