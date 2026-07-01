-- OrigamiStory: 物語の英語対応（bilingual）
-- Supabase ダッシュボード > SQL Editor に貼り付けて 1 回だけ実行してください。
-- 1) 英語用の列を追加（既にあれば無視される）
-- 2) 既存 5 問に英訳を投入

alter table public.problems
  add column if not exists story_en text not null default '';

update public.problems set story_en = '"I"—a small creature—woke on a planet of thin air.

No name, no memory. Only the mark of a small ring on my belly.

Each time the sky rumbled low, the ring trembled, and a voice within whispered:

—"Deliver it to Earth."

Earth? I don''t know it—so why do I know it?' where id = '64716763-47f0-45b0-8422-f68da5c2896d';

update public.problems set story_en = 'As I walked, the sand leapt like static, and far off I saw a wreck of metal.

A human probe ship. When I touched its console, a recording began to play.

"We need the observation data. The answer to gravity will save Earth."

The date on the screen was decades ahead of what I felt.

Time is out of sync.' where id = 'c5add4dd-0613-4e79-b1f0-59b2557bbdfb';

update public.problems set story_en = 'The black lake at the valley floor did not reflect the stars—it opened onto another sky.

When I touched its surface, a blue sphere—Earth—appeared, and a vision poured in: cities sinking beneath the water.

A voice, laced with static. "This is Earth. Please respond."

For some reason, that voice sounded like my own.' where id = 'abb21c98-184d-4f16-8b40-2948171491a4';

update public.problems set story_en = 'Deep within the lake lay a space woven from a lattice of light.

As I stepped inside, a single second stretched long, and the beat of my heart grew distant.

A sleeping AI awoke.

"You are a living memory. You were made to send the observations of gravity into the future."

The ring on my belly is a transmitter.

But once I send it—I return to nothing.' where id = '7add39b4-fb1b-41a3-b798-ab182238ff2f';

update public.problems set story_en = 'At the center of the lattice, I pressed my fingertip to the ring.

The probe''s data, the future the lake had shown me, the time-slip I had met along the way—

I bound them all into a single signal.

"Deliver it to Earth." That first voice had been a signal my future self cast back into the past.

The transmission began, and my body unraveled into grains of light.

In the sky of Earth, an answering light was lit.' where id = 'be9400ea-73ee-4584-a99e-6ee58d6fb495';

-- 確認用: 各行に英語が入ったかチェック
select id, left(story, 20) as story_ja_head, left(story_en, 20) as story_en_head from public.problems order by created_at;
