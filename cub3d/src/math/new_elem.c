/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   new_elem.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/04 23:52:22 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/30 18:01:15 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

t_pt	new_pt(double x_pos, double y_pos)
{
	t_pt	pt;

	pt.x = x_pos;
	pt.y = y_pos;
	return (pt);
}

t_pt	dup_pt(t_pt src)
{
	t_pt	dst;

	dst.x = src.x;
	dst.y = src.y;
	return (dst);
}

t_vec	new_vec(t_pt start, t_pt end)
{
	t_vec	vec;

	vec.rad = hypot(end.x - start.x, end.y - start.y);
	vec.theta = atan2(end.y - start.y, end.x - start.x);
	vec.s = start;
	vec.e = end;
	return (vec);
}

t_vec	dup_vec(t_vec src)
{
	t_vec	dst;

	dst.rad = src.rad;
	dst.theta = src.theta;
	dst.s = dup_pt(src.s);
	dst.e = dup_pt(src.e);
	return (dst);
}
