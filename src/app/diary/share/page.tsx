"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import AppHeader from "@/components/layout/AppHeader";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/Toast";
import { getLevelProgress } from "@/lib/progression";
import { useDiaryStore } from "@/store/useDiaryStore";

const HASHTAGS = ["#CGV", "#파코니", "#시네마다이어리"];

/** PRD §8 화면 08 — 씨네톡 공유 (FR-10) */
export default function SharePage() {
  const router = useRouter();
  const nickname = useDiaryStore((s) => s.nickname);
  const entries = useDiaryStore((s) => s.entries);
  const addPost = useDiaryStore((s) => s.addPost);
  const showToast = useToast((s) => s.show);
  const [comment, setComment] = useState("");

  const count = entries.length;
  const { level } = getLevelProgress(count);

  const handlePost = () => {
    addPost({
      author: nickname,
      avatarColor: "#FF2949",
      body: comment.trim() || `파코니 Lv.${level} 달성! ${count}편째 관람`,
      hashtags: HASHTAGS,
      likes: 0,
      comments: 0,
      mine: true,
      shareCard: { level, count },
    });
    showToast("씨네톡에 게시했어요 🍿");
    router.push("/cinetalk");
  };

  return (
    <MobileContainer>
      <div className="min-h-screen pb-10">
        <AppHeader title="씨네톡 공유" />

        <Hydrated fallback={<div className="h-[300px]" />}>
          {/* 공유 카드 미리보기 */}
          <div className="px-5 pt-3">
            <div className="overflow-hidden rounded-card bg-cgv-gray-100 p-6 text-center">
              <div className="flex justify-center">
                <PaconiCharacter level={level} size={140} />
              </div>
              <p className="mt-3 text-[22px] font-bold text-cgv-black">파코니 Lv.{level} 달성!</p>
              <p className="mt-1.5 text-body text-cgv-gray-600">{count}편째 관람</p>
              <p className="mt-4 text-sub text-cgv-red">{HASHTAGS.join(" ")}</p>
            </div>
          </div>

          {/* 코멘트 (선택) */}
          <div className="px-5 pt-5">
            <p className="mb-2 text-sub text-cgv-gray-600">코멘트 (선택)</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="함께 남길 한마디를 적어보세요"
              className="w-full resize-none rounded-btn border border-black/10 p-3 text-body text-cgv-black placeholder:text-cgv-gray-400"
            />
          </div>

          <div className="px-5 pt-6">
            <PrimaryButton onClick={handlePost}>씨네톡에 게시</PrimaryButton>
          </div>
        </Hydrated>
      </div>
    </MobileContainer>
  );
}
