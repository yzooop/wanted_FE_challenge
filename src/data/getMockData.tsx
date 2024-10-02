import { MOCK_DATA, MockData, MockDataResponse } from "./mockData";

export const PER_PAGE = 9;

// 페이지는 1부터 시작함
export const getMockData = async (
    pageNum: number
): Promise<MockDataResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const datas: MockData[] = MOCK_DATA.slice(
                PER_PAGE * (pageNum - 1),
                PER_PAGE * pageNum
            );
            const isEnd = PER_PAGE * (pageNum + 1) >= MOCK_DATA.length;

            resolve({ datas, isEnd });
        }, 1500);
    });
};
