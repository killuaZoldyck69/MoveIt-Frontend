import { Spinner } from "./spinner";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
};

export default Loading;
