import { Bars } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Bars
        height={40}
        width={40}
        color="#3B82F6" // Custom color for the spinner
        visible={true}
        ariaLabel="oval-loading"
      />
    </div>
  );
};

export default Loader;
