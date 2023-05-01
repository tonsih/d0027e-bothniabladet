drop database if exists bothniabladet;
create database bothniabladet;
use bothniabladet;

create table bothniabladet.user(
  user_id     serial,
  first_name  varchar(15)             not null,
  last_name   varchar(15)             not null,
  email       varchar(50)   unique    not null,
  password    varchar(70)             not null,
  banned      boolean                 not null,
  admin       boolean                 not null,

  constraint pk_user primary key(user_id),

  constraint user_email_format check (`email` regexp "^[a-za-z0-9][a-za-z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-za-z0-9._-]?@[a-za-z0-9][a-za-z0-9._-]*?[a-za-z0-9]?\\.[a-za-z]{2,63}$"),

  constraint user_fname_blank check (first_name <> ''),
  constraint user_lname_blank check (last_name <> ''),
  constraint user_email_blank check (email <> ''),
  constraint user_password_blank check (password <> '')
);

alter table bothniabladet.user alter banned set default false;
alter table bothniabladet.user alter admin set default false;

create table bothniabladet.shopping_cart(
  shopping_cart_id      serial,
  user_id               bigint  unsigned    unique    not null,
  total_price           double  unsigned              not null,

  constraint pk_shopping_cart primary key(shopping_cart_id),

  constraint fk_user_shopping_cart 
  foreign key(user_id) references bothniabladet.user(user_id)
  on delete cascade
);

alter table bothniabladet.shopping_cart alter total_price set default 0;

create table bothniabladet.`order`(
  order_id              serial,
  user_id               bigint            unsigned    not null,
  total_price           double            unsigned    not null,
  order_date            datetime                      not null,

  constraint pk_order primary key(order_id),

  constraint fk_user_order 
  foreign key(user_id) references bothniabladet.user(user_id)
  on delete cascade
);

alter table bothniabladet.`order` alter total_price set default 0;

alter table `bothniabladet`.`order` modify `order_date` timestamp not null default current_timestamp on update current_timestamp;
set time_zone = 'Europe/Stockholm';

create table bothniabladet.tag(
  tag_id          serial,
  name            varchar(100)   unique    not null,

  constraint pk_tag primary key(tag_id)
);

create table bothniabladet.technical_metadata(
  technical_metadata_id           serial,
  coordinates                     varChar(100),                
  camera_type                     varchar(100),
  format                          varchar(100),
  last_modified                   datetime,
  `size`                          bigint  unsigned,
  width                           bigint  unsigned,
  height                          bigint  unsigned,

  constraint pk_technical_metadata primary key(technical_metadata_id)
);

create table bothniabladet.image(
  image_id                    serial,
  technical_metadata_id       bigint        unsigned,
  title                       varchar(50)   not null,
  description                 varchar(300),
  image_url                   varChar(500),                
  price                       double        unsigned   not null,
  journalist                  varchar(100),
  uses                        bigint        unsigned   not null,
  distributable               boolean,
  deleted                     boolean,

  constraint pk_image primary key(image_id),

  constraint fk_technical_metadata_image
  foreign key(technical_metadata_id) references bothniabladet.technical_metadata(technical_metadata_id)
  on delete set null
);

alter table bothniabladet.image alter image_url set default null;
alter table bothniabladet.image alter deleted set default false;

create table bothniabladet.requested_image(
  requested_image_id          serial,
  title                       varchar(50),
  description                 varchar(300),
  image_url                   varChar(500),                
  journalist                  varchar(100),
  email                       varchar(50)   not null,

  constraint pk_requested_image primary key(requested_image_id)
);

create table bothniabladet.version(
  version_id                  serial,
  version_no                  bigint        unsigned     not null,
  image_id                    bigint        unsigned     not null,
  original_id                 bigint        unsigned     not null,
  created_at                  datetime,

  constraint pk_version primary key(version_id),

  constraint fk_image_version
  foreign key(image_id) references bothniabladet.image(image_id)
  on delete cascade,

  constraint fk_original_id
  foreign key(original_id) references bothniabladet.image(image_id)
  on delete cascade
);

create table bothniabladet.image_tag(
  image_id          bigint     unsigned   not null,
  tag_id            bigint     unsigned   not null,

  constraint pk_image_tag primary key(image_id, tag_id),

  constraint fk_image_image_tag 
  foreign key(image_id) references bothniabladet.image(image_id)
  on delete cascade,

  constraint fk_tag_image_tag
  foreign key(tag_id) references bothniabladet.tag(tag_id)
  on delete cascade
);

create table bothniabladet.order_image(
  order_id          bigint     unsigned   not null,
  image_id          bigint     unsigned   not null,

  constraint pk_order_image primary key(order_id, image_id),

  constraint fk_order_order_image 
  foreign key(order_id) references bothniabladet.`order`(order_id)
  on delete cascade,

  constraint fk_image_order_image 
  foreign key(image_id) references bothniabladet.image(image_id)
  on delete cascade
);

create table bothniabladet.shopping_cart_image(
  shopping_cart_image_id    serial,
  shopping_cart_id          bigint   unsigned   not null,
  image_id                  bigint   unsigned   not null,
  time_added                datetime            not null,

  constraint pk_shopping_cart_image primary key(shopping_cart_image_id),

  constraint fk_shopping_cart_shopping_cart_image 
  foreign key(shopping_cart_id) references bothniabladet.shopping_cart(shopping_cart_id)
  on delete cascade,

  constraint fk_image_shopping_cart_image 
  foreign key(image_id) references bothniabladet.image(image_id)
  on delete cascade,

  constraint uc_shopping_cart_image unique(shopping_cart_id, image_id)
);

create table bothniabladet.offer(
  offer_id                  serial,
  discount                  double   unsigned   not null,
  start_date                datetime,
  end_date                  datetime,

  constraint pk_offer primary key(offer_id)
);

create table bothniabladet.image_offer(
  image_id          bigint     unsigned   not null,
  offer_id          bigint     unsigned   not null,

  constraint pk_order_image primary key(image_id, offer_id),

  constraint fk_image_image_offer
  foreign key(image_id) references bothniabladet.image(image_id)
  on delete cascade,

  constraint fk_offer_image_offer
  foreign key(offer_id) references bothniabladet.offer(offer_id)
  on delete cascade
);

create table bothniabladet.user_offer(
  user_id          bigint     unsigned   not null,
  offer_id         bigint     unsigned   not null,

  constraint pk_order_image primary key(user_id, offer_id),

  constraint fk_user_user_offer
  foreign key(user_id) references bothniabladet.user(user_id)
  on delete cascade,

  constraint fk_offer_user_offer
  foreign key(offer_id) references bothniabladet.offer(offer_id)
  on delete cascade
);

/*
------------------------------------------------------------------------
  insertion of data
------------------------------------------------------------------------
*/

insert into bothniabladet.user 
(first_name,  last_name,  email,             admin,   password) VALUES 
('admin',     'admin',  'admin@bothnia.se',  true,    '$2b$10$YwyBdxMw9QhfKb3VpDG1jeuuA4AuCQBLuB8omOL3k0JAE5UULJ53G');

insert into bothniabladet.shopping_cart 
(user_id, total_price) values 
(1,       48.33);

insert into bothniabladet.tag
(name) values 
('Natur'), ('Abstrakt'), ('Kubism');

insert into bothniabladet.image
(title,              price,     uses,   description,                distributable) values 
("mount everest",    13,        6,      "highest mountain",         true),
("haaaa",            33.33,     0,      "ha ha he he",              false),
("kubi",    	       2,	        3,      "cubism at it's finest",    true),
("mount everest",    23,        6,      "super high mountain",         true);

insert into bothniabladet.shopping_cart_image
(shopping_cart_id,  image_id,    time_added) values 
(1,                   1,         now()),
(1,                   3,         now());

insert into bothniabladet.image_tag
(image_id, tag_id) values 
(1,        1),
(2,        2),
(3,        3),
(3,        2);

insert into bothniabladet.version
(version_no,   image_id,    original_id,   created_at) values 
(1,            1,           1,             date_sub(now(),interval 1 month)),
(2,            4,           1,             now()),
(1,            2,           2,             now()),
(1,            3,           3,             now());

delimiter $$
/*
------------------------------------------------------------------------
  procedures
------------------------------------------------------------------------
*/

/*
example:

call bothniabladet.update_shopping_cart_total_price(1);

*/
create procedure bothniabladet.update_shopping_cart_total_price(
  in par_shopping_cart_id bigint
)
  begin
    declare var_total_price double;

    set var_total_price := (
      select sum(price)
        from shopping_cart_image
        join image using (image_id)
        group by shopping_cart_id
        having shopping_cart_id=par_shopping_cart_id
    );

    update shopping_cart set total_price=var_total_price where shopping_cart_id=par_shopping_cart_id;
    
  end $$

/*
example:

call bothniabladet.update_order_total_price(1);

*/
create procedure bothniabladet.update_order_total_price
(
  in par_order_id bigint
)
  begin
    declare var_total_price double;

    set var_total_price := (
      select sum(price) 
        from order_image 
        join `order`using (order_id) 
        join image using (image_id)
        group by order_id
        having order_id=par_order_id
      );

    update `order` set total_price=var_total_price where order_id=par_order_id;

  end $$

delimiter ;
/*
------------------------------------------------------------------------
  triggers
------------------------------------------------------------------------
*/

create trigger bothniabladet.email_to_lower 
before insert on bothniabladet.`user` for each row
    set new.email := lower(new.email);

create trigger bothniabladet.total_order_price_insert 
after insert on bothniabladet.order_image for each row
      call bothniabladet.update_order_total_price(new.order_id);

create trigger bothniabladet.total_order_price_update
after update on bothniabladet.order_image for each row
      call bothniabladet.update_order_total_price(old.order_id);

create trigger bothniabladet.total_order_price_delete
after delete on bothniabladet.order_image for each row
      call bothniabladet.update_order_total_price(old.order_id);

create trigger bothniabladet.total_shopping_cart_price_insert
after insert on bothniabladet.shopping_cart_image for each row
      call bothniabladet.update_shopping_cart_total_price(new.shopping_cart_id);

create trigger bothniabladet.total_shopping_cart_price_update
after update on bothniabladet.shopping_cart_image for each row
      call bothniabladet.update_shopping_cart_total_price(old.shopping_cart_id);

create trigger bothniabladet.total_shopping_cart_price_delete
after delete on bothniabladet.shopping_cart_image for each row
      call bothniabladet.update_shopping_cart_total_price(old.shopping_cart_id);

/*
------------------------------------------------------------------------
  events
------------------------------------------------------------------------
*/

drop event if exists bothniabladet.clean_shopping_cart;

create event bothniabladet.clean_shopping_cart
    on schedule
      every 3 second
    do        
        delete from bothniabladet.shopping_cart_image
        where shopping_cart_image_id 
        in 
        (select shopping_cart_image_id 
          from shopping_cart_image
          where time_added < date_sub(now(), interval 33 minute));
