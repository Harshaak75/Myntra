export default function Signin(){
    return(
        <div className="overflow-hidden">
            <div className="h-[90.5vh] bg-[#FDEFEA] flex items-center justify-center">
                <div className="w-[20rem]">
                    <div className=""></div>
                    <div className="signin flex flex-col gap-5 bg-white">
                        <div className="title text-2xl font">SignIn</div>
                        <div className="number"><input type="text" name="" id="" className="bg-[#F5F5F6] w-[18rem] p-2 rounded border focus:bg-white outline-none border-none" placeholder="Email Id*"/></div>
                        <div className="text-sm">By continuing, i agree to the Terms of Use & Privacy Policy</div>
                        <div className="button flex items-center justify-center"><input type="button" value="Continue" /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}