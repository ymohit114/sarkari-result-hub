const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recategorize() {
  const posts = await prisma.jobPost.findMany();
  console.log(`Checking ${posts.length} posts for accurate categorization...`);

  let updated = 0;
  for (const post of posts) {
    const t = post.title.toLowerCase();

    // Remove unwanted terms / policy pages
    if (t.includes('scholarship') || t.includes('terms and conditions') || t.includes('privacy policy') || t.includes('disclaimer')) {
      await prisma.jobPost.delete({ where: { id: post.id } });
      console.log(`[DELETED] Unwanted page: ${post.title}`);
      continue;
    }

    let correctCat = 'latest-jobs';

    if (t.includes('admit card') || t.includes('hall ticket') || t.includes('call letter') || t.includes('city intimation')) {
      correctCat = 'admit-card';
    } else if (t.includes('answer key') || t.includes('response sheet') || t.includes('objection')) {
      correctCat = 'answer-key';
    } else if (t.includes('syllabus') || t.includes('exam pattern')) {
      correctCat = 'syllabus';
    } else if (t.includes('admission') || t.includes('entrance') || t.includes('ph.d') || t.includes('counseling')) {
      correctCat = 'admission';
    } else if (t.includes('result') || t.includes('score card') || t.includes('merit list') || t.includes('selection list') || t.includes('marks')) {
      correctCat = 'results';
    } else if (t.includes('online form') || t.includes('recruitment') || t.includes('apply online') || t.includes('vacancy') || t.includes('posts')) {
      correctCat = 'latest-jobs';
    }

    if (post.category !== correctCat) {
      await prisma.jobPost.update({
        where: { id: post.id },
        data: { category: correctCat }
      });
      console.log(`[RE-CATEGORIZED] "${post.title.slice(0, 45)}" -> ${correctCat}`);
      updated++;
    }
  }

  const counts = await prisma.jobPost.groupBy({ by: ['category'], _count: true });
  console.log(`\nUpdated ${updated} posts. New category distribution:`, counts);
}

recategorize()
  .then(() => process.exit(0))
  .catch(console.error);
