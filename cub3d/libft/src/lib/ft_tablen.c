/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_tablen.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/23 06:26:11 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 04:25:59 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/libft.h"

size_t	ft_tablen(char **tab, const char *str)
{
	size_t	len;

	len = 0;
	while (tab && ft_strncmp(tab[len], str, ft_strlen(str, 0)) && tab[len])
		len++;
	return (len);
}
