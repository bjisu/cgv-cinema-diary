"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import PaconiCharacter from "@/components/diary/PaconiCharacter";
import AppHeader from "@/components/layout/AppHeader";
import BottomTab from "@/components/layout/BottomTab";
import Hydrated from "@/components/layout/Hydrated";
import MobileContainer from "@/components/layout/MobileContainer";
import { formatWatchedAt } from "@/lib/format";
import { useDiaryStore } from "@/store/useDiaryStore";

/** FR-10 — 씨네톡 목업 피드. 공유한 내 게시물이 최상단에 노출된다. */
export default function CinetalkPage() {
  const posts = useDiaryStore((s) => s.posts);

  return (
    <MobileContainer>
      <div className="pb-tabbar">
        <AppHeader title="씨네톡" showBack={false} />

        <Hydrated fallback={<div className="h-[400px]" />}>
          <ul className="flex flex-col">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-black/5 px-5 py-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-cgv-white"
                    style={{ backgroundColor: post.avatarColor }}
                  >
                    {post.author.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-bold text-cgv-black">
                      {post.author}
                      {post.mine && (
                        <span className="ml-1.5 text-[10px] font-bold text-cgv-red">MY</span>
                      )}
                    </p>
                    <p className="text-caption text-cgv-gray-400">
                      {formatWatchedAt(post.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-body leading-relaxed text-cgv-black">{post.body}</p>

                {/* 내 게시물이면 공유 카드도 함께 노출 */}
                {post.shareCard && (
                  <div className="mt-3 flex items-center gap-4 rounded-card bg-cgv-gray-100 p-4">
                    <PaconiCharacter level={post.shareCard.level} size={72} />
                    <div>
                      <p className="text-[17px] font-bold text-cgv-black">
                        파코니 Lv.{post.shareCard.level} 달성!
                      </p>
                      <p className="mt-1 text-sub text-cgv-gray-600">
                        {post.shareCard.count}편째 관람
                      </p>
                    </div>
                  </div>
                )}

                <p className="mt-2.5 text-sub text-cgv-red">{post.hashtags.join(" ")}</p>

                <div className="mt-3 flex items-center gap-4 text-cgv-gray-600">
                  <span className="flex items-center gap-1 text-sub">
                    <Heart size={16} strokeWidth={1.8} /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-sub">
                    <MessageCircle size={16} strokeWidth={1.8} /> {post.comments}
                  </span>
                  <span className="flex items-center gap-1 text-sub">
                    <Share2 size={16} strokeWidth={1.8} /> 공유
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Hydrated>
      </div>

      <BottomTab active="cinetalk" />
    </MobileContainer>
  );
}
