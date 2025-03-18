import { AssetList } from "@/features/assets";
import { FC } from "react";

const HomePage: FC = ({}) => {
  return (
    <main className="flex items-center">
      <section className="w-full">
        <div className="max-w-[1480px] w-full mx-auto">
          <AssetList />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
