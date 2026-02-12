"use client";

import { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

import { Menu, Settings } from "lucide-react";

type ModalType = "settings" | "menu" | null;

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const handleCloseModal = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".modal")) return;
      setModal(null);
    };

    window.addEventListener("click", handleCloseModal);
    return () => {
      window.removeEventListener("click", handleCloseModal);
    };
  }, []);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">로딩 중...</div>;
  }

  const handleModal = (e: React.MouseEvent<HTMLDivElement>, modalType: ModalType) => {
    e.stopPropagation();
    setModal(modal === modalType ? null : modalType);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 bg-red-300">
      <header className="w-full bg-gray-400">
        <div className="flex h-full items-center justify-between px-2 py-1">
          <div className="left-menu flex gap-2">
            <Image src="/logos/nexus_os.svg" alt="Nexus OS Logo" width={25} height={25} />
            <span className="text-lg font-bold text-white">Nexus OS</span>
          </div>
          <div className="right-menu flex gap-2">
            <div
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-gray-600 p-1.5 text-white hover:bg-gray-700"
              onClick={(e) => handleModal(e, "menu")}
            >
              <Menu />
              {modal === "menu" && (
                <div className="modal absolute top-10 right-0 box-border w-70 rounded bg-white p-3 text-start break-all text-black shadow-lg">
                  <div className="mb-3 flex gap-2 border-b pb-2">
                    <Menu />
                    <div>메뉴</div>
                  </div>
                  <div>
                    <div>회원 정보</div>
                    <div>닉네임: {session.user.name}</div>
                    <div>이메일: {session.user.email}</div>
                    <div>아이디: {session.user.id}</div>
                  </div>
                  <div
                    onClick={() => signOut({ redirect: true })}
                    className="mt-4 w-full cursor-pointer rounded bg-red-500 py-2 text-center text-white hover:bg-red-600"
                  >
                    로그아웃
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-gray-600 p-1.5 text-white hover:bg-gray-700"
              onClick={(e) => handleModal(e, "settings")}
            >
              <Settings />
              {modal === "settings" && (
                <div className="modal absolute top-10 right-0 box-border w-70 rounded bg-white p-3 text-start break-all text-black shadow-lg">
                  <div className="mb-3 flex gap-2 border-b pb-2">
                    <Settings />
                    <div>설정</div>
                  </div>
                  <div>설정 항목이 여기에 표시됩니다.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <footer className="mt-auto flex h-12 w-full items-center justify-center">
        <div className="max-w-lg bg-gray-400">© 2024 Nexus OS</div>
      </footer>
    </div>
  );
}
