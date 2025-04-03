/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   math.h                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/04 04:02:53 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/05 19:03:49 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MATH_H

# define MATH_H
# include <math.h>

typedef struct s_pt
{
	double	x;
	double	y;
}			t_pt;

typedef struct s_vec
{
	t_pt	s;
	t_pt	e;
	double	rad;
	double	theta;
}			t_vec;

double	rad(double deg);
double	rad_to_deg(double rad);

double	pt_dst(t_pt A, t_pt B);
double	pt_to_vec_dst(t_pt P, t_vec vec);
int		pt_in_trgl(t_pt P, t_pt A, t_pt B, t_pt C);

void	slide_vec(t_vec *vec, double x, double y);
void	slide_along_vec(t_vec *vec, double step);
void	stretch_vec(t_vec *vec, double step);
void	rotate_vec(t_vec *vec, t_pt center, double theta);

t_pt	new_pt(double x_pos, double y_pos);
t_pt	dup_pt(t_pt src);
t_vec	new_vec(t_pt start, t_pt end);
t_vec	dup_vec(t_vec src);

void	print_pt_values(t_pt *pt, float_t id);
void	print_vec_values(t_vec *vec, float_t id);

double	dot(t_vec A, t_vec B);

#endif
