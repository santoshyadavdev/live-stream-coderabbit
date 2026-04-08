import { OutOfOrderSchedule } from '@org/models';

interface DateRange {
  startDate: string;
  endDate: string;
}

export class OOOScheduleService {
  private schedules: OutOfOrderSchedule[] = [
    {
      id: 'ooo-1',
      roomId: 'room-205',
      startDate: '2026-04-10',
      endDate: '2026-04-20',
      reason: 'renovation',
      notes: 'Bathroom tile and fixture upgrade.',
    },
  ];

  scheduleOOO(input: Omit<OutOfOrderSchedule, 'id'>): OutOfOrderSchedule {
    if (this.hasOverlap(input.roomId, input.startDate, input.endDate)) {
      throw new Error('Overlapping out-of-order schedule exists for this room');
    }

    const schedule: OutOfOrderSchedule = {
      id: `ooo-${Date.now()}`,
      ...input,
    };

    this.schedules.push(schedule);
    return schedule;
  }

  cancelOOO(id: string): boolean {
    const initialLength = this.schedules.length;
    this.schedules = this.schedules.filter((schedule) => schedule.id !== id);
    return this.schedules.length < initialLength;
  }

  getSchedulesByRoom(roomId: string): OutOfOrderSchedule[] {
    return this.schedules.filter((schedule) => schedule.roomId === roomId);
  }

  getSchedulesByDateRange(range: DateRange): OutOfOrderSchedule[] {
    return this.schedules.filter((schedule) =>
      this.isRangeOverlapping(schedule.startDate, schedule.endDate, range.startDate, range.endDate)
    );
  }

  isRoomAvailable(roomId: string, range: DateRange): boolean {
    return !this.schedules.some(
      (schedule) =>
        schedule.roomId === roomId &&
        this.isRangeOverlapping(schedule.startDate, schedule.endDate, range.startDate, range.endDate)
    );
  }

  private hasOverlap(roomId: string, startDate: string, endDate: string): boolean {
    return this.schedules.some(
      (schedule) =>
        schedule.roomId === roomId &&
        this.isRangeOverlapping(schedule.startDate, schedule.endDate, startDate, endDate)
    );
  }

  private isRangeOverlapping(
    existingStartDate: string,
    existingEndDate: string,
    candidateStartDate: string,
    candidateEndDate: string
  ): boolean {
    const existingStart = new Date(existingStartDate).getTime();
    const existingEnd = new Date(existingEndDate).getTime();
    const candidateStart = new Date(candidateStartDate).getTime();
    const candidateEnd = new Date(candidateEndDate).getTime();

    return candidateStart <= existingEnd && existingStart <= candidateEnd;
  }
}
