live demo: https://ontario-student-voice.vercel.app
github: https://github.com/exelentshakil/ontario-student-voice
video intro: https://youtube.com/shorts/kK3XZd5PNOk

built an interactive prototype with your exact 7-stage call flow so you can test it on real ontario records right now.

vapi vs grok voice:
vapi is the only production option here. it has native twilio sip trunking with toronto pop termination (sub-400ms latency), mid-call deterministic tool calling (log_verbal_consent, warm_transfer), and structured webhooks. grok voice lacks canadian pstn trunking and reliable mid-call function execution.

how the flow works:
1. mandatory ai disclosure and 2-party recording notice in first 5s.
2. identity check against your records.
3. verifies program, city, and employment status.
4. asks the core enrolment question and intake timeframe.
5. sets tuition expectations upfront: clearly states these are tuition-based diploma programs, not free training, no job guarantee. filters out mismatches right away.
6. captures timestamped verbal consent with a sha-256 audit hash.
7. branches: warm transfers or books callbacks for confirmed leads, flags stale numbers for purge, and permanently enforces dnc opt-outs.

batch dialer locks to ontario crtc hours (mon-sat 9am-8pm est, sundays blocked) and syncs 14 typed fields to airtable via n8n.

former lead engineer at legiit ($1m arr). 10-12 day turnaround for the $1,500 fixed scope including the 60-min handover call.

let's talk,
shakil
