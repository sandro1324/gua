#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Author: 钉钉或微信pythontesting 钉钉群21734177
# CreateDate: 2019-2-21

import argparse
import collections
import pprint
import datetime
import functools
import logging

from bidict import bidict

from datas import *
from ganzhi import *
from sizi import summarys

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("bazi_calc.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("bazi-calc")

# 使用LRU缓存装饰器
def cache_result(func):
    @functools.lru_cache(maxsize=1000)
    def wrapper(*args, **kwargs):
        try:
            start_time = datetime.datetime.now()
            result = func(*args, **kwargs)
            end_time = datetime.datetime.now()
            duration = (end_time - start_time).total_seconds()
            logger.info(f"{func.__name__} 计算完成，耗时: {duration:.3f}秒")
            return result
        except Exception as e:
            logger.error(f"{func.__name__} 计算出错: {str(e)}")
            raise
    return wrapper

@cache_result
def check_gan(gan, gans):
    """检查天干的合冲关系
    Args:
        gan: 要检查的天干
        gans: 天干列表
    Returns:
        str: 合冲关系描述
    """
    try:
        result = ''
        if ten_deities[gan]['合'] in gans:
            result += "合" + ten_deities[gan]['合']
        if ten_deities[gan]['冲'] in gans:
            result += "冲" + ten_deities[gan]['冲']
        return result
    except KeyError as e:
        logger.error(f"天干数据查询错误: {str(e)}")
        raise ValueError(f"无效的天干: {gan}")

def yinyang(item):
    if item in Gan:
        return '＋' if Gan.index(item)%2 == 0 else '－'
    else:
        return '＋' if Zhi.index(item)%2 == 0 else '－'
    
def yinyangs(zhis):
    result = []
    for item in zhis:
        result.append(yinyang(item))
    if set(result) == set('＋'):
        print("四柱全阳")
    if set(result) == set('－'):
        print("四柱全阴")
    
    
    
    
def get_empty(zhu, zhi):
    empty = empties[zhu]
    if zhi in empty:
        return "空"
    return ""

@cache_result
def get_zhi_detail(zhi, me, multi=1):
    """获取地支详细信息
    Args:
        zhi: 地支
        me: 日主
        multi: 倍数
    Returns:
        str: 地支详细信息
    """
    try:
        out = ''
        for gan in zhi5[zhi]:
            try:
                out = out + "{}{}{}{} ".format(
                    gan,
                    gan5.get(gan, ''),
                    zhi5[zhi].get(gan, 0) * multi,
                    ten_deities[me].get(gan, '')
                )
            except KeyError as e:
                logger.warning(f"数据查询警告: {str(e)}")
                continue
        return out.strip()
    except Exception as e:
        logger.error(f"获取地支详细信息出错: {str(e)}")
        return ""

def check_gong(zhis, n1, n2, me, hes, desc='三合拱'):
    result = ''
    if zhis[n1] + zhis[n2] in hes:
        gong = hes[zhis[n1] + zhis[n2]] 
        if gong not in zhis:
            result += "\t{}：{}{}-{}[{}]".format(
                desc, zhis[n1], zhis[n2], gong, get_zhi_detail(gong, me))
    return result