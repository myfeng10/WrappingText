import type { NextPage } from 'next';

import ConnectionComponent from "@/components/ConnectionCom";
import PartitionComponent from "@/components/PartitionCom";
import TextComponent from "@/components/TextCom";
import ConnectionTextComponent from '@/components/ConnectionTextCom'; 
import FinalComponent from '@/components/FinalResult';
import PartitionComponent2 from '@/components/PartitionCom2';

import Square from '@/components/Square';
const Home: NextPage = () => {
    const blocks = [
        { text: "Block 1" },
        { text: "Block 2" },
        { text: "Block 3" },
        { text: "Block 4" }
      ];
  return (
    <div>
      <FinalComponent />
        <TextComponent />
        <PartitionComponent />
        <FinalComponent />
        {/* <ConnectionComponent /> */}
        {/* <ConnectionTextComponent /> */}
        
     

    </div>
  );
};

export default Home;