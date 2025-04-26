'use client';

import Tabs from "./tabs";
import { Chatroom } from "./chatroom";

export default function PortableAI() {


  return (
    <div className="flex max-w-xl mx-auto p-4 border border-red-500">
      <Tabs />
      <Chatroom />
    </div>
  );
}
