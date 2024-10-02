import { useState, useEffect, useRef, useCallback } from "react";
import { MockData } from "../data/mockData";
import { getMockData } from "../data/getMockData";
import styled from "styled-components";

const DataItem = () => {
    const [items, setItems] = useState<MockData[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0); // 상품 가격 합계 상태

    // 데이터 가져오기
    useEffect(() => {
        setLoading(true);
        getMockData(page).then(({ datas, isEnd }) => {
            setItems((prevItems) => [...prevItems, ...datas]);
            setTotalPrice(
                (prevTotal) =>
                    prevTotal + datas.reduce((acc, item) => acc + item.price, 0)
            );
            setIsEnd(isEnd);
            setLoading(false);
        });
    }, [page]);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return; // 로딩 중이면 실행하지 않음
            if (observer.current) observer.current.disconnect(); // 이전 관찰자 해제

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !isEnd) {
                        setPage((prevPage) => prevPage + 1); // 페이지 번호 증가
                    }
                },
                {
                    rootMargin: "0px",
                }
            );

            if (node) observer.current.observe(node); // 요소 관찰 시작
        },
        [loading, isEnd]
    );

    return (
        <div>
            <StickyHeader>
                <h1>상품 리스트</h1>
                <p>총 합계: {totalPrice}원</p>
            </StickyHeader>
            <BoxContainer>
                {items.map((item, index) => {
                    const isLastItem = index === items.length - 1; // 마지막 아이템 여부 확인

                    return (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            key={index}
                        >
                            <ItemBox
                                ref={isLastItem ? lastItemRef : null} // 마지막 아이템에만 ref를 적용
                            >
                                <Name>{item.productName}</Name>
                                <Price>가격: {item.price}원</Price>
                                <PurchaseDate>
                                    구매일자:{" "}
                                    {new Date(
                                        item.boughtDate
                                    ).toLocaleDateString()}
                                </PurchaseDate>
                            </ItemBox>
                        </div>
                    );
                })}
            </BoxContainer>
            {loading && <p style={{ textAlign: "center" }}>로딩 중...</p>}
            {isEnd && (
                <p style={{ textAlign: "center" }}>마지막 페이지 입니다.</p>
            )}
        </div>
    );
};

export default DataItem;

const StickyHeader = styled.div`
    position: sticky;
    top: 0;
    background-color: white;
    padding: 10px 0;
    z-index: 100;
    text-align: center;
`;

const BoxContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 80%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`;

const ItemBox = styled.div`
    width: 300px;
    height: 200px;
    box-sizing: border-box;
    border-radius: 30px;
    padding: 20px 20px;
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    background-color: #f0f0f0;
`;

const Name = styled.p`
    margin: 0;
    font-size: 20px;
    font-weight: 700;
`;

const Price = styled.p`
    margin: 0;
    font-size: 18px;
`;

const PurchaseDate = styled.p`
    margin: 0;
    font-size: 15px;
`;
