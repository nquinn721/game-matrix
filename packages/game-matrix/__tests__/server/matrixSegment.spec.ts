import { MatrixSegment } from "../../src/server/matrixSegment";

describe("Matrix Segment", () => {
  let ms: any[] = [[], [], []];

  beforeEach(() => {
    ms[0].push(new MatrixSegment(100, 0, 0));
    ms[0].push(new MatrixSegment(100, 0, 1));
    ms[0].push(new MatrixSegment(100, 0, 2));
    ms[1].push(new MatrixSegment(100, 1, 0));
    ms[1].push(new MatrixSegment(100, 1, 1));
    ms[1].push(new MatrixSegment(100, 1, 2));
    ms[2].push(new MatrixSegment(100, 2, 0));
    ms[2].push(new MatrixSegment(100, 2, 1));
    ms[2].push(new MatrixSegment(100, 2, 2));
  });

  it("should setup segment 1", () => {
    const s = ms[0][0];
    expect(s.w).toEqual(100);
    expect(s.h).toEqual(100);
    expect(s.x).toEqual(0);
    expect(s.y).toEqual(0);
    expect(s.endx).toEqual(100);
    expect(s.endy).toEqual(100);
    expect(s.id).toEqual("grid-row-0-col-0");
    expect(s.items).toEqual([]);
    expect(s.players).toEqual([]);
  });

  it("should setup segment 2", () => {
    const s = ms[0][1];
    expect(s.x).toEqual(101);
    expect(s.y).toEqual(0);
    expect(s.endx).toEqual(200);
    expect(s.endy).toEqual(100);
    expect(s.id).toEqual("grid-row-0-col-1");
  });

  it("should setup segment 3", () => {
    const s = ms[0][2];
    expect(s.x).toEqual(201);
    expect(s.y).toEqual(0);
    expect(s.endx).toEqual(300);
    expect(s.endy).toEqual(100);
    expect(s.id).toEqual("grid-row-0-col-2");
  });

  it("should setup segment 4", () => {
    const s = ms[1][0];
    expect(s.x).toEqual(0);
    expect(s.y).toEqual(101);
    expect(s.endx).toEqual(100);
    expect(s.endy).toEqual(200);
    expect(s.id).toEqual("grid-row-1-col-0");
  });

  it("should setup segment 5", () => {
    const s = ms[1][1];
    expect(s.x).toEqual(101);
    expect(s.y).toEqual(101);
    expect(s.endx).toEqual(200);
    expect(s.endy).toEqual(200);
    expect(s.id).toEqual("grid-row-1-col-1");
  });

  it("should setup segment 6", () => {
    const s = ms[1][2];
    expect(s.x).toEqual(201);
    expect(s.y).toEqual(101);
    expect(s.endx).toEqual(300);
    expect(s.endy).toEqual(200);
    expect(s.id).toEqual("grid-row-1-col-2");
  });

  it("should setup segment 7", () => {
    const s = ms[2][0];
    expect(s.x).toEqual(0);
    expect(s.y).toEqual(201);
    expect(s.endx).toEqual(100);
    expect(s.endy).toEqual(300);
    expect(s.id).toEqual("grid-row-2-col-0");
  });

  it("should setup segment 8", () => {
    const s = ms[2][1];
    expect(s.x).toEqual(101);
    expect(s.y).toEqual(201);
    expect(s.endx).toEqual(200);
    expect(s.endy).toEqual(300);
    expect(s.id).toEqual("grid-row-2-col-1");
  });

  it("should setup segment 9", () => {
    const s = ms[2][2];
    expect(s.x).toEqual(201);
    expect(s.y).toEqual(201);
    expect(s.endx).toEqual(300);
    expect(s.endy).toEqual(300);
    expect(s.id).toEqual("grid-row-2-col-2");
  });
});
