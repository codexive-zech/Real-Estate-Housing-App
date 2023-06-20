import spinner from "../assets/spinner.svg";

const Spinner = () => {
  return (
    <>
      <section className=" relative">
        <div className=" flex flex-col items-center justify-center fixed top-0 right-0 left-0 bottom-0 z-30">
          <div className=" flex items-center">
            <img src={spinner} alt="Loading Spinner" />
          </div>
          <h1 className=" text-2xl md:text-3xl font-bold text-purple-600 capitalize">
            Made By Zechariah
          </h1>
        </div>
      </section>
    </>
  );
};

export default Spinner;
