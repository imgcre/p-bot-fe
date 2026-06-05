import { LoaderFunction } from "react-router-dom";

export const jloader: LoaderFunction = async () =>  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).renderData ?? null;
}