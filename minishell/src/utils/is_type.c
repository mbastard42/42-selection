/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   is_type.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/15 14:54:02 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 02:23:57 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

int	is_stralnum(char *str, int alpha, int num)
{
	size_t	i;

	i = -1;
	while (str && str[++i])
		if (!is_alnum(str[i], alpha, num))
			return (0);
	return (1);
}

int	is_alnum(char c, int alpha, int num)
{
	if (alpha && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')))
		return (1);
	if (num && (c >= '0' && c <= '9'))
		return (1);
	return (0);
}

int	is_name(char c, int first)
{
	if (first && (is_alnum(c, 1, 0) || c == '_'))
		return (1);
	if (!first && (is_alnum(c, 1, 1) || c == '_'))
		return (1);
	return (0);
}

int	is_strname(char *str, char end_char)
{
	size_t	i;

	i = 0;
	if (str && str[i] != end_char && is_name(str[i], 1))
		i++;
	while (str && str[i] != end_char && is_name(str[i], 0))
		i++;
	if (str[i] && str[i] != end_char)
		return (0);
	return (1);
}

int	is_quotes(char c)
{
	if (ft_strchr("\'\"", c, 0))
		return (1);
	return (0);
}
