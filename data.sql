CREATE SCHEMA `Bookshop` DEFAULT CHARACTER SET utf8;

CREATE TABLE `Bookshop`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
);

-- name 컬럼 삭제
ALTER TABLE `Bookshop`.`users`
DROP COLUMN `name`;

-- salt 컬럼 추가
ALTER TABLE `Bookshop`.`users`
ADD COLUMN `salt` VARCHAR(45) NULL AFTER `password`;

CREATE TABLE `Bookshop`.`books` (
  `id` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `format` VARCHAR(45) NOT NULL,
  `isbn` VARCHAR(45) NOT NULL,
  `summary` VARCHAR(500) NULL,
  `description` LONGTEXT NULL,
  `author` VARCHAR(45) NULL,
  `pages` INT NOT NULL,
  `index` LONGTEXT NULL,
  `price` INT NOT NULL,
  `pub_date` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `isbn_UNIQUE` (`isbn` ASC) VISIBLE);

-- id AUTO_INCREMENT 추가
ALTER TABLE `Bookshop`.`books`
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

INSERT INTO `Bookshop`.`books` (`title`, `format`, `isbn`, `summary`, `description`, `author`, `pages`, `index`, `price`, `pub_date`) VALUES ('어린왕자', '종이책', '0', '사막여우', '《어린 왕자》는 프랑스의 비행사이자 작가인 앙투안 드 생텍쥐페리가 1943년 발표한 중편 소설이다. 1943년에 미국에서 처음 출판되었고, 그 해 비시 프랑스 치하의 프랑스에서 비밀리에 출판되었다.', '앙투안 드 생텍쥐페리', '100', '목차', '20000', '2019-01-01');
INSERT INTO `Bookshop`.`books` (`title`, `format`, `isbn`, `summary`, `description`, `author`, `pages`, `index`, `price`, `pub_date`) VALUES ('신데렐라', '종이책', '1', '유리구두', '신데렐라는 부당한 학대와 시련 속에서도 주인공 신데렐라가 고난을 이겨내고 초자연적인 원조자의 도움을 받아 결국에는 행복한 삶을 맞는다는 신화적 요소를 담고 있는 유럽의 민담 구전설화이다.', '작가미상', '100', '목차', '20000', '2023-12-01');
INSERT INTO `Bookshop`.`books` (`title`, `format`, `isbn`, `summary`, `description`, `author`, `pages`, `index`, `price`, `pub_date`) VALUES ('백설공주', '종이책', '2', '사과', '《백설공주》는 2025년 개봉한 미국의 뮤지컬 판타지 영화이다. 마크 웨브가 감독을 맡았으며, 1937년 동명 디즈니 애니메이션 영화를 실사화한 작품이다. 배우 레이철 제글러가 주인공 백설공주를 연기한다.', '그림 형제', '100', '목차', '20000', '2023-11-01');
INSERT INTO `Bookshop`.`books` (`title`, `format`, `isbn`, `summary`, `description`, `author`, `pages`, `index`, `price`, `pub_date`) VALUES ('흥부와 놀부', '종이책', '3', '제비와 박씨', '\'흥부와 놀부\'는 한국의 대표적인 전래동화로, 욕심 많고 심술궂은 형 놀부와 착하고 성실한 동생 흥부의 이야기를 다룹니다. 부모님이 돌아가신 후 놀부가 모든 재산을 차지하고 흥부 가족을 내쫓았지만, 흥부가 다친 제비를 구해준 덕분에 박씨를 얻고 복을 받는 반면, 놀부는 제비의 다리를 부러뜨린 벌을 받아 재앙을 맞는다는 \'권선징악\'의 교훈을 담고 있습니다. ', '작가미상', '100', '목차', '20000', '2023-12-31');

-- format, description, index 컬럼명 변경
ALTER TABLE `Bookshop`.`books`
CHANGE COLUMN `format` `form` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `description` `detail` LONGTEXT NULL DEFAULT NULL ,
CHANGE COLUMN `index` `contents` LONGTEXT NULL DEFAULT NULL ;

-- 이미지 컬럼 추가
ALTER TABLE Bookshop.books
ADD COLUMN img INT NULL AFTER title;

UPDATE `Bookshop`.`books` SET `img` = '7' WHERE (`id` = '5');
UPDATE `Bookshop`.`books` SET `img` = '10' WHERE (`id` = '6');
UPDATE `Bookshop`.`books` SET `img` = '60' WHERE (`id` = '7');
UPDATE `Bookshop`.`books` SET `img` = '90' WHERE (`id` = '8');

ALTER TABLE `Bookshop`.`books`
ADD COLUMN `category_id` INT NOT NULL AFTER `img`;

UPDATE `Bookshop`.`books` SET `category_id` = '1' WHERE (`id` = '7');
UPDATE `Bookshop`.`books` SET `category_id` = '2' WHERE (`id` = '8');

-- category 테이블 생성
CREATE TABLE `Bookshop`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
-- name 컬럼 길이 변경
ALTER TABLE `Bookshop`.`category`
CHANGE COLUMN `name` `name` VARCHAR(100) NOT NULL ;

INSERT INTO `Bookshop`.`category` (`name`) VALUES ('동화');
INSERT INTO `Bookshop`.`category` (`name`) VALUES ('소설');
INSERT INTO `Bookshop`.`category` (`name`) VALUES ('사회');

ALTER TABLE `Bookshop`.`category`
CHANGE COLUMN `id` `id` INT(11) NOT NULL ;

UPDATE `Bookshop`.`category` SET `id` = '0' WHERE (`id` = '1');
UPDATE `Bookshop`.`category` SET `id` = '1' WHERE (`id` = '2');
UPDATE `Bookshop`.`category` SET `id` = '2' WHERE (`id` = '3');

ALTER TABLE `Bookshop`.`books`
ADD INDEX `category_id_idx` (`category_id` ASC) VISIBLE;
;
ALTER TABLE `Bookshop`.`books`
ADD CONSTRAINT `category_id`
  FOREIGN KEY (`category_id`)
  REFERENCES `Bookshop`.`category` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `Bookshop`.`category`
CHANGE COLUMN `name` `category_name` VARCHAR(100) NOT NULL ;

SELECT * FROM Bookshop.books
LEFT JOIN category
ON books.category_id = category_id;

SELECT * FROM Bookshop.books
LEFT JOIN category
ON books.category_id = category_id
WHERE books.id = 5;

-- 데이터 추가
INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("콩쥐 팥쥐", 4, 0, "ebook", 4, "콩팥..", "콩심은데 콩나고..", "김콩팥", 100, "목차입니다.", 20000, "2025-12-07");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("용궁에 간 토끼", 5, 1, "종이책", 5, "깡충..", "용왕님 하이..", "김거북", 100, "목차입니다.", 20000, "2025-10-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..!", "김해님", 100, "목차입니다.", 20000, "2025-07-16");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2025-03-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2025-02-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백석..", "김심청", 100, "목차입니다.", 20000, "2025-01-15");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되버림..", "김영감", 100, "목차입니다.", 20000, "2025-06-05");

SELECT DATE_ADD(NOW(), INTERVAL 1 MONTH);
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH);
SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();

SELECT * FROM books;
SELECT * FROM books LIMIT 4 OFFSET 8;
SELECT * FROM books LIMIT 8, 4;

SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() LIMIT 3 OFFSET 4;

-- likes 테이블 생성
CREATE TABLE `Bookshop`.`likes` (
  `user_id` INT(11) NOT NULL,
  `liked_book_id` INT(11) NOT NULL);

-- 좋아요 추가
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 5);
-- 좋아요 취소
DELETE FROM likes WHERE user_id = 1 AND liked_book_id = 5;

SELECT COUNT(*) FROM likes WHERE liked_book_id = 5;
-- 좋아요 개수가 포함된 books 테이블 조회
SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books;

-- 사용자가 좋아요를 했는지 여부를 포함
SELECT EXISTS (SELECT * FROM likes WHERE user_id = 1 AND liked_book_id = 16);

SELECT *,
(SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
(SELECT EXISTS (SELECT * FROM likes WHERE user_id = 1 AND liked_book_id = 5)) AS liked
FROM books
LEFT JOIN category
ON books.category_id = category.category_id
WHERE books.id = 5;

CREATE TABLE `Bookshop`.`cartItems` (
  `id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `num` INT NOT NULL DEFAULT 1,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`));

-- 장바구니 담기
INSERT INTO cartItems (book_id, quantity, user_id) VALUES (5, 1, 1);
-- 장바구니 목록 조회
SELECT cartItems.id, book_id, title, summary, quantity, price
FROM cartItems
LEFT JOIN books ON cartItems.book_id = books.id
WHERE user_id = 1;
-- 장바구니 도서 삭제
DELETE FROM cartItems WHERE id = 1;
-- 장바구니에서 선택한(장바구니 도서 id) 아이템 목록 조회 = 선택한 장바구니 상품 목록 조회
SELECT * FROM cartItems
WHERE user_id = 1
AND id IN (1, 3);

-- 주문하기
-- 배송 정보 입력
INSERT INTO delivery (address, receiver, contact) VALUES ('서울시 중구', '백하연', '010-1234-5678');
-- 주문 정보 입력
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
VALUES ('백설공주', 3, 60000, 1, 1);
-- 주문 상세 목록 입력
INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (1, 5, 1);

SELECT MAX(id) FROM Bookshop.orderedBook;
SELECT LAST_INSERT_ID();

-- 결제된 도서 장바구니 삭제
DELETE FROM cartItems WHERE id IN (1,2,3);

-- 주문 내역 조회
SELECT orders.id, book_title, total_quantity, total_price, created_at, address, receiver, contact
FROM orders
LEFT JOIN delivery
ON orders.delivery_id = delivery.id;

SELECT * FROM Bookshop.books LIMIT 4 OFFSET 0;
SELECT COUNT(*) FROM Bookshop.books;

SELECT SQL_CALC_FOUND_ROWS * FROM Bookshop.books LIMIT 4 OFFSET 0;
SELECT FOUND_ROWS();