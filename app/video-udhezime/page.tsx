import { redirect } from 'next/navigation';

/**
 * The video library now lives inside the unified Support page.
 * Old links and bookmarks keep working via this redirect.
 */
export default function VideoUdhezimeRedirect() {
  redirect('/asistenti?tab=video');
}
