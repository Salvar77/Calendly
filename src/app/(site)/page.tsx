import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="text-center mt-36">
        <p className="text-gray-600">Trusted by those companies:</p>
        <div className="flex gap-8 *:h-6 mt-5 justify-center">
          <img
            src="https://images.ctfassets.net/lh3zuq09vnm2/1FA2gEsWeu2MyGSy6Qp6ao/859833105cdd6ed5cc75eb5e4bd9cff7/HelloFresh.svg"
            alt="3"
          ></img>
          <img
            src="https://images.ctfassets.net/lh3zuq09vnm2/4Y87kRrhSPSYgUbSWYxP1z/a13177cf43f99e7a79c691c54e271a98/Hubspot.svg"
            alt="3"
          ></img>
          <img
            src="https://images.ctfassets.net/lh3zuq09vnm2/7dsuPwH4V8KJvCexSZueZc/272b2ef619de8ae4b443758413a19733/Unbounce_Logo.svg"
            alt="3"
          ></img>
          <img
            src="https://images.ctfassets.net/lh3zuq09vnm2/vHHaKAaEeQuNcucdWM50V/23351da3b1ad9d7483ddf11aed64b4b7/Mixpanel.svg"
            alt="3"
          ></img>
          <img
            src="https://images.ctfassets.net/lh3zuq09vnm2/6jZ182ywMavcqhY7WiLS5x/fb3c393066ae09dc17819472dc605d8f/15Five.svg"
            alt="3"
          ></img>
        </div>
      </section>
    </>
  );
}
