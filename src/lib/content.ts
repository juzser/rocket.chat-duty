export const ContentGeneral = {
    announceCaption: (start: string, team: string) => {
        return `:calendar_spiral: :broom: ${team} trực nhật tuần này (${start}).`;
    },
    repeatCaption: (start: string, team: string) => {
        return `:calendar_spiral: :broom: ${team} chưa hoàn thành đủ công việc tuần trước nên tiếp tục trực nhật tuần này (${start}).`;
    },
    doneAJob: (label: string) => {
        return `:white_check_mark: :muscle: Hooray! Team trực nhật đã ${label}`;
    },
    notFinishAJob: (label: string) => {
        return `:no_entry_sign: Hoá ra click nhầm ${label}`;
    },
    commands: {
        show: (team: string, finish?: string) => {
            return `Trực nhật tuần này: ${team}
            ${ finish ? `:white_check_mark: Đã hoàn thành: ${finish}` : ''}
            `;
        },
        prev: (team: string, finish?: string) => {
            return `Trực nhật tuần trước: ${team}
            ${ finish ? `:white_check_mark: Đã hoàn thành: ${finish}` : ''}
            `;
        },
        next: (team: string) => {
            return `Trực nhật tuần sau: ${team}`;
        },
        list: (teamList) => {
            let result = ':clipboard: *Danh sách team trực nhật:*\n';
            teamList.map((e, index) => {
                result += `*Team ${index + 1}:* ${e.join(', ')}\n`;
                return e;
            });
            return result;
        },
    },

    error: {
        noDuty: 'Đã bắt đầu phiên trực nhật khác hoặc tin nhắn không còn hiệu lực.',
        dutyEnded: 'Phiên trực nhật đã kết thúc.',
        notOwner: 'Bạn không phải trực nhật tuần này.',
        notset: 'Lịch trực nhật tuần này chưa được cập nhật.',
        noPrev: 'Lịch trực nhật tuần trước không có hoặc đã bị xoá.',
        noNext: 'Chưa xác định được người trực nhật tiếp theo.',
    },

    help: `*Commands:*
    \`/duty show\` - Xem ai trực nhật tuần này & danh sách việc.
    \`/duty next\` - Xem ai trực nhật tuần sau.
    \`/duty prev\` - Xem ai trực nhật tuần trước. Các việc đã hoàn thành.
    \`/duty list\` - Xem danh sách & thứ tự các team.
    `,
};
