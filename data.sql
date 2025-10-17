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