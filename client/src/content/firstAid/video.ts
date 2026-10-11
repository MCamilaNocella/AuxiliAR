import type { GuideVideo } from "./types"

/**
 * A video is shown in a guide only with its whole record: clinical review (who, when), the guide of reference it matches, the permission to
 * embed it, and a reviewed transcript as the alternative. Without any part, it is not shown and the guide is exactly as before.
 */
export const isVideoShown = (video: GuideVideo | undefined): video is GuideVideo => {
  const approval = video?.approval
  if (!video || !approval) return false
  return Boolean(
    approval.clinicalReview.by.trim() &&
      approval.clinicalReview.date &&
      approval.currentWith.reference.trim() &&
      approval.currentWith.date &&
      approval.permission.basis.trim() &&
      approval.transcriptReviewed &&
      video.transcript &&
      video.transcript.length > 0 &&
      video.originalUrl.startsWith("https://"),
  )
}
