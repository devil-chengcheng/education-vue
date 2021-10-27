CREATE TABLE `acl_permission` (
	`id` char(19) NOT NULL DEFAULT '' COMMENT '编号',
	`pid` char(19) NOT NULL DEFAULT '' COMMENT '所属上级',
	`name` varchar(20) NOT NULL DEFAULT '' COMMENT '名称',
	`type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '类型（1：菜单， 2： 按钮）',
	`permission_value` varchar(50) DEFAULT NULL COMMENT '权限值',
	`path` varchar(100) DEFAULT NULL COMMENT '访问路径',
	`component` varchar(100) DEFAULT NULL COMMENT '组件路径',
	`icon` varchar(50) DEFAULT NULL COMMENT '图标',
	`status` tinyint(4) DEFAULT NULL COMMENT '状态（0：禁止，1：正常）',
	`is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '逻辑删除 1（true）已删除，0（false）未删除',
	`gmt_create` datetime DEFAULT NULL COMMENT '创建时间',
	`gmt_modified` datetime DEFAULT NULL COMMENT '更新时间',
	PRIMARY KEY (`id`),
	KEY `idx_pid` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限';


CREATE TABLE `acl_role` (
	`id` char(19) NOT NULL DEFAULT '' COMMENT '角色id',
	`role_name` varchar(20) NOT NULL DEFAULT '' COMMENT '角色名称',
	`role_code` varchar(20) DEFAULT NULL COMMENT '角色编码',
	`remark` varchar(255) DEFAULT NULL COMMENT '备注',
	`is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '逻辑删除 1（true）已删除， 0（false）未删除',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '角色';

CREATE TABLE `acl_role_permission` (
	`id` char(19) NOT NULL DEFAULT '',
	`role_id` char(19) NOT NULL DEFAULT '',
	`permission_id` char(19) NOT NULL DEFAULT '',
	`is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '逻辑删除 1（true）已删除， 0（false）未删除',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '更新时间',
	PRIMARY KEY (`id`),
	KEY `idx_role_id` (`role_id`),
	KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色权限';

CREATE TABLE `acl_user` (
	`id` char(19) NOT NULL COMMENT '会员id',
	`username` varchar(20) NOT NULL DEFAULT '' COMMENT '微信openid',
	`password` varchar(32) NOT NULL DEFAULT '' COMMENT '密码',
	`nick_name` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像',
  `token` varchar(100) DEFAULT NULL COMMENT '用户签名',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '逻辑删除 1（true）已删除， 0（false）未删除',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE `acl_user_role` (
  `id` char(19) NOT NULL DEFAULT '' COMMENT '主键id',
  `role_id` char(19) NOT NULL DEFAULT '0' COMMENT '角色id',
  `user_id` char(19) NOT NULL DEFAULT '0' COMMENT '用户id',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '逻辑删除 1（true）已删除， 0（false）未删除',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;